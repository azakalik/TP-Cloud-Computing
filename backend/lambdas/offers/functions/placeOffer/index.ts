import {SQS} from 'aws-sdk';
import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { JwtPayload } from 'jwt-decode';
import { offersHandler } from '@shared/mainHandler';
import { getJwtPayload } from '@shared/getJwtPayload';
import { validateBody } from '@shared/validateBody';
import { getUserBalance } from '@shared/getUserBalance';
import { BalanceTable } from '@shared/balanceTable';
import { getHighestOffer } from '@shared/getHighestOffer';

const region = process.env.AWS_REGION;
const offersTableName = "offers";
const balanceTableName = "balance";
const closedAuctionsTableName = "closed_auctions";

type RequestBody = {
    publicationId: string;
    price: number;
}

type Offer = {
    publicationId: string;
    userId: string;
    price: number;
};

const asserter = (body: RequestBody): string | null => {
    if (!body) {
        return 'Offer is required';
    }
    if (!body.publicationId) {
        return 'Publication ID is required';
    }
    if (!body.price) {
        return 'Price is required';
    }
    if (body.price <= 0) {
        return 'Price must be greater than 0';
    }
    return null;
}

export const handler = async (event: APIGatewayProxyEventV2) => 
    await offersHandler(async (client) => {
        let payload: JwtPayload;

        try {
            payload = await getJwtPayload(event);
        } catch (error) {
            console.error('Error while getting JWT payload', error);
            return {
                statusCode: 401,
                body: {error: 'Unauthorized'},
            };
        }

        // https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-using-the-id-token.html
        const userId = payload.sub;

        if (!userId) {
            console.error('User ID is missing in the JWT payload');
            return {
                statusCode: 401,
                body: {error: 'Unauthorized'},
            };
        }

        const validation = validateBody(event.body, asserter);

        if (validation.error !== null) {
            return {
                statusCode: 400,
                body: {error: validation.error}
            };
        }

        const requestBody = validation.params;

        const offer: Offer = {
            publicationId: requestBody.publicationId,
            userId,
            price: requestBody.price,
        };

        const {publicationId, price} = offer;

        // Check user has enough funds
        const balance = await getUserBalance(client, userId);
        if (!balance || balance.available < price) {
            return {
                statusCode: 400,
                body: {error: 'Insufficient funds'},
            };
        }

        // Check the auction is still open
        const auction = await client.query<{exists: boolean}>(
            `SELECT EXISTS (
                SELECT 1
                FROM ${closedAuctionsTableName}
                WHERE publication_id = $1
            )`,
            [publicationId]
        );

        if (auction.rows[0].exists) {
            return {
                statusCode: 400,
                body: {error: 'Auction is closed'},
            };
        }

        // Get the current highest offer for the publication
        const highestOffer = await getHighestOffer(client, publicationId);

        // Check if the new offer is higher than the highest offer
        const currentPrice = highestOffer ? highestOffer.price : 0;

        if (price <= currentPrice) {
            return {
                statusCode: 400,
                body: {error: 'Price must be higher than the highest offer'},
            };
        }

        // Refund the previous highest offer
        if (highestOffer) {
            const previousUserId = highestOffer.user_id;
            await client.query(
                `UPDATE ${balanceTableName} SET available = available + $1 WHERE user_id = $2`,
                [currentPrice, previousUserId]
            );
        }

        // Deduct the new offer from the user balance
        const newBalanceResult = await client.query<BalanceTable>(
            `UPDATE ${balanceTableName} SET available = available - $1 WHERE user_id = $2 RETURNING *`,
            [price, userId]
        );

        const newBalance = newBalanceResult.rows[0];

        // Insert the new offer
        await client.query(
            `INSERT INTO ${offersTableName} (offer_id, publication_id, user_id, time, price)
             VALUES (gen_random_uuid(), $1, $2, NOW(), $3)`,
            [publicationId, userId, price]
        );

        // Send a message to the offers queue
        const sqsUrl = process.env.SQS_URL;
        if (!sqsUrl) {
            throw new Error('SQS URL is not provided');
        }
        const sqsParams = {
            QueueUrl: sqsUrl,
            MessageBody: JSON.stringify(offer),
        };
        
        const endpoint = process.env.SQS_ENDPOINT;
        if (!endpoint) {
            throw new Error('SQS endpoint is not provided');
        }
        const sqs = new SQS({region, endpoint});
        await sqs.sendMessage(sqsParams).promise();

        return {
            statusCode: 200,
            body: {message: 'Offer placed successfully', total: newBalance.total, available: newBalance.available}
        };
    });