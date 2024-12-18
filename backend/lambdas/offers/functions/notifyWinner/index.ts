import { PublishCommand, SNSClient } from "@aws-sdk/client-sns";
import { getHighestOffer } from "@shared/getHighestOffer";
import { offersHandler } from "@shared/mainHandler";
import { validateBody } from "@shared/validateBody";
import { APIGatewayProxyEventV2 } from "aws-lambda";

const region = process.env.AWS_REGION;
const accountId = process.env.ACCOUNT_ID;
const balanceTableName = "balance";
const closedAuctionsTableName = "closed_auctions";

export const handler = async (event: APIGatewayProxyEventV2) =>
    await offersHandler(async (client) => {
        const {
            title: publicationTitle,
            publicationId,
            email: vendorEmail,
        } = event;

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

        let winnerEmailRows = null

        if (user_id != null) {
            //obtain the winners email
            winnerEmailRows = await client.query(
                `SELECT email FROM ${balanceTableName} WHERE user_id = $1`,
                [user_id]
            );

            if (winnerEmailRows.rows.length <= 0) {
                console.error("WINNER EMAIL NOT FOUND", winnerEmailRows);
                return {
                    statusCode: 401,
                    body: { message: "Winner was not found" },
                };
            }
        }

        let winnerEmail = winnerEmailRows?.rows[0]?.email; // Access the email from the first row
        console.log("winnerEmail", winnerEmail)
        // Notify the winner through sns
        const topicArn = `arn:aws:sns:${region}:${accountId}:${publicationId}`;
        const snsEndpoint = process.env.SNS_ENDPOINT;
        if (!snsEndpoint) {
            throw new Error("SNS endpoint is not provided");
        }

        const snsClient = new SNSClient({
            region,
            endpoint: snsEndpoint,
        });

        const message =
            user_id === null
                ? `The auction for publication ${publicationTitle} with id ${publicationId} has ended with no offers.`
                : `The winner of the auction for publication ${publicationTitle} with id ${publicationId} is user ${winnerEmail} with a price of $${price}. Please contact the vendor at ${vendorEmail}.`;

        const snsParams = {
            TopicArn: topicArn,
            Message: message,
        };

        await snsClient.send(new PublishCommand(snsParams));

        return {
            statusCode: 200,
            body: { message: "Winner notified" },
        };
    });
