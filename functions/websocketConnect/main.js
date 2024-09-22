// Import necessary clients and commands from AWS SDK v3
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, TransactWriteCommand } from '@aws-sdk/lib-dynamodb';
import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda'; // Import Lambda SDK

// Initialize DynamoDB Client
const ddbClient = new DynamoDBClient({ region: 'us-east-1' });  // Replace with your region
const ddb = DynamoDBDocumentClient.from(ddbClient);

// Initialize Lambda Client
const lambdaClient = new LambdaClient({ region: 'us-east-1' });  // Replace with your region

export const handler = async (event) => {
    const { requestContext, queryStringParameters } = event;
    
    // Extract connectionId from the WebSocket requestContext
    const connectionId = requestContext.connectionId;
    
    // Extract userId and publicationId from query string parameters
    const { userId, publicationId } = queryStringParameters || {};

    // Check if userId and publicationId exist
    if (!userId || !publicationId) {
        return {
            statusCode: 400,
            body: 'userId and publicationId are required.'
        };
    }

    // Prepare the transactional write params
    const params = {
        TransactItems: [
            {
                Put: {
                    TableName: "USER_SESSIONS",
                    Item: {
                        PK: `CONID#${connectionId}`,
                        SK: "DEFAULT",
                        publicationId,
                    }
                }
            },
            {
                Put: {
                    TableName: "USER_SESSIONS",
                    Item: {
                        PK: `PUBID#${publicationId}`,
                        SK: `CONID#${connectionId}`,
                        userId
                    }
                }
            }
        ]
    };

    // Execute the transactional write using TransactWriteCommand
    try {
        await ddb.send(new TransactWriteCommand(params));
        console.log('Connection ID stored successfully.');

        // Now call the second Lambda asynchronously (non-blocking)
        const lambdaParams = {
            FunctionName: 'maxPriceGetter', // Replace with your second Lambda's name
            InvocationType: 'Event', // Asynchronous invocation
            Payload: JSON.stringify({ connectionId }) // Pass the connectionId
        };

        // Invoke the second Lambda asynchronously and await the invocation to complete
        const response = await lambdaClient.send(new InvokeCommand(lambdaParams));
        console.log('Second Lambda invoked asynchronously.', response);

        return {
            statusCode: 200,
            body: 'Connection ID stored successfully, and second Lambda invoked.'
        };
    } catch (err) {
        console.error('Error storing connection or invoking Lambda:', err);
        return {
            statusCode: 500,
            body: 'Error storing connection ID or invoking Lambda: ' + JSON.stringify(err)
        };
    }
};
