import { SNSClient, SubscribeCommand } from '@aws-sdk/client-sns';
import { STSClient, GetCallerIdentityCommand } from '@aws-sdk/client-sts';
import { jwtDecode } from 'jwt-decode';

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


const snsClient = new SNSClient({ region: process.env.AWS_REGION });
const stsClient = new STSClient({ region: process.env.AWS_REGION });

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

    console.log(payload);
    const email = payload.email;
    if (!email){
        console.error("No email in", payload);
        throw new Error("No email in payload");
    }


    try {
        // Retrieve the publicationId from the query parameters
        const publicationId = request.queryStringParameters?.publicationId;
        if (!publicationId) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Missing publicationId query parameter" }),
            };
        }


        // Retrieve the AWS Account ID using STS
        const identity = await stsClient.send(new GetCallerIdentityCommand({}));
        const accountId = identity.Account;
        
        // Construct the Topic ARN
        const region = process.env.AWS_REGION;
        const topicArn = `arn:aws:sns:${region}:${accountId}:${publicationId}`;
        console.log(`Constructed Topic ARN: ${topicArn}`);

        // Subscribe the email to the SNS topic
        const subscribeParams = {
            TopicArn: topicArn,
            Protocol: 'email',
            Endpoint: email
        };
        const subscribeResponse = await snsClient.send(new SubscribeCommand(subscribeParams));

        // Check if the subscription is pending confirmation
        const subscriptionArn = subscribeResponse.SubscriptionArn;
        if (subscriptionArn === 'PendingConfirmation') {
            console.log(`A confirmation email has been sent to ${email}. Subscription is pending until confirmed.`);
            return {
                statusCode: 200,
                body: JSON.stringify({ operation: "PENDING_SUSCRIPTION", message: "Subscription pending confirmation. Check your email to confirm." }),
            };
        }

        console.log(`Email ${email} successfully subscribed with ARN: ${subscriptionArn}`);
        return {
            statusCode: 200,
            body: JSON.stringify({ operation: "ALREADY_SUSCRIBED", message: `Subscription confirmed for ${email}.` }),
        };

    } catch (error) {
        console.error("Error subscribing to SNS topic:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to subscribe to SNS topic." }),
        };
    }
};
