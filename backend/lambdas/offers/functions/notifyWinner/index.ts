import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';
import { getHighestOffer } from '@shared/getHighestOffer';
import { offersHandler } from '@shared/mainHandler';
import { validateBody } from '@shared/validateBody';
import { APIGatewayProxyEventV2 } from 'aws-lambda';

const region = process.env.AWS_REGION;
const accountId = process.env.ACCOUNT_ID;
const balanceTableName = "balance";
const closedAuctionsTableName = "closed_auctions";

type RequestBody = {
    publicationId: string;
    email: string;
}

const asserter = (body: RequestBody): string | null => {
    if (!body) {
        return 'Body is required';
    }
    if (!body.publicationId) {
        return 'Publication ID is required';
    }
    if (!body.email) {
        return 'Email is required';
    }
    return null;
}

export const handler = async (event: APIGatewayProxyEventV2) => 
    await offersHandler(async (client) => {
        const { publicationId, email: vendorEmail } = event;

        // Get the highest offer for the publication
        const highestOffer = await getHighestOffer(client, publicationId);

        const { price = null, user_id = null, time = null } = highestOffer || {};

        // Update the balance of the winner
        if (highestOffer !== null) {
            await client.query(
                `UPDATE ${balanceTableName} SET total = total - $1 WHERE user_id = $2`,
                [price, user_id]
            );
        }

        // Add the publication to the closed auctions table
        await client.query(
            `INSERT INTO ${closedAuctionsTableName} (publication_id, user_id, price, time, close_time) VALUES ($1, $2, $3, $4, NOW())`,
            [publicationId, user_id, price, time]
        );

        // Notify the winner through sns
        const topicArn = `arn:aws:sns:${region}:${accountId}:${publicationId}`;
        const snsEndpoint = process.env.SNS_ENDPOINT;
        if (!snsEndpoint) {
            throw new Error('SNS endpoint is not provided');
        }

        const snsClient = new SNSClient({
            region,
            endpoint: snsEndpoint
        });

        const snsParams = {
            TopicArn: topicArn,
            Message: `The winner of the auction is user ${user_id} with a price of $${price}. Please contact the vendor at ${vendorEmail}.`,
        };

        await snsClient.send(new PublishCommand(snsParams));

        return {
            statusCode: 200,
            body: {message: 'Winner notified'},
        };
    });
