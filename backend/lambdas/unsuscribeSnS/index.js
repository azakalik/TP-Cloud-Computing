import { SNSClient, ListSubscriptionsByTopicCommand, UnsubscribeCommand } from "@aws-sdk/client-sns";
import { jwtDecode } from 'jwt-decode';

const snsClient = new SNSClient({ region: process.env.AWS_REGION });

const getJwtPayload = async (request) => {
    const token = request?.headers?.['authorization'];
    if (!token) {
        throw new Error('Authorization token is missing');
    }
    const regex = /Bearer (.+)/;
    const match = token.match(regex);
    if (!match) {
        throw new Error('Invalid authorization token');
    }
    const jwt = match[1];
    const payload = jwtDecode(jwt); // jwtDecode is synchronous, no need for await
    return payload;
};

export const handler = async (request) => {
    let payload = null;
    try {
        payload = await getJwtPayload(request);
    } catch (error) {
        console.error('Error while getting JWT payload', error);
        return {
            statusCode: 401,
            body: JSON.stringify({ error: 'Unauthorized' }),
        };
    }

    const publicationId = request.queryStringParameters?.publicationId;
    if (!publicationId) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Missing publicationId query parameter" }),
        };
    }

    const email = payload.email;
    const topicArn = `arn:aws:sns:${process.env.AWS_REGION}:${process.env.ACCOUNT_ID}:${publicationId}`;

    if (!email || !topicArn) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Email and SNS topic ARN are required" }),
        };
    }

    try {
        // List subscriptions for the SNS topic to find the specific subscription
        const listCommand = new ListSubscriptionsByTopicCommand({ TopicArn: topicArn });
        let subscriptionArn = null;

        let response;
        do {
            response = await snsClient.send(listCommand);

            // Find the subscription that matches the email
            const subscription = response.Subscriptions.find(
                sub => sub.Endpoint === email && sub.Protocol === "email"
            );

            if (subscription) {
                subscriptionArn = subscription.SubscriptionArn;
                break; // Exit loop if the subscription is found
            }

            // Set the NextToken for pagination
            listCommand.input.NextToken = response.NextToken;
        } while (response.NextToken);

        if (!subscriptionArn) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: `No subscription found for email ${email}` }),
            };
        }

        // Unsubscribe the email from the topic
        const unsubscribeCommand = new UnsubscribeCommand({ SubscriptionArn: subscriptionArn });
        await snsClient.send(unsubscribeCommand);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: `Unsubscribed ${email} from the topic` }),
        };
    } catch (error) {
        console.error("Error unsubscribing from topic:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to unsubscribe from SNS topic" }),
        };
    }
};
