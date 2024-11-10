import { SNSClient, ListSubscriptionsByTopicCommand } from "@aws-sdk/client-sns";
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


    let payload = null
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


    console.log(payload);
    const email = payload.email;

    const topicArn = `arn:aws:sns:${process.env.AWS_REGION}:${process.env.ACCOUNT_ID}:${publicationId}`;
 
    if (!email || !topicArn) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Email and SNS topic ARN are required" }),
        };
    }

    try {
        // Initialize the command to list subscriptions for the SNS topic
        const command = new ListSubscriptionsByTopicCommand({ TopicArn: topicArn });
        let isSubscribed = false;

        // Paginate through all subscriptions for the topic
        let response;
        do {
            response = await snsClient.send(command);

            // Check if the email is in the current batch of subscriptions
            isSubscribed = response.Subscriptions.some(
                subscription => subscription.Endpoint === email && subscription.Protocol === "email"
            );

            if (isSubscribed) break; // Exit loop if the email is found

            // Set the next token for pagination
            command.input.NextToken = response.NextToken;
        } while (response.NextToken);

        return {
            statusCode: 200,
            body: JSON.stringify({
                email,
                isSubscribed,
                message: isSubscribed
                    ? `${email} is subscribed to the topic.`
                    : `${email} is not subscribed to the topic.`,
            }),
        };
    } catch (error) {
        console.error("Error checking subscription status:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to check subscription status" }),
        };
    }
};
