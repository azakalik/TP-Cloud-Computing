// Import necessary clients and commands from AWS SDK v3
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, TransactWriteCommand } from '@aws-sdk/lib-dynamodb';

// Initialize DynamoDB Client
const ddbClient = new DynamoDBClient({ region: process.env.AWS_REGION });  // Replace with your region
const ddb = DynamoDBDocumentClient.from(ddbClient);

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
    
    const tableName = process.env.TABLE_NAME;

    // Prepare the transactional write params
    const params = {
        TransactItems: [
            {
                Put: {
                    TableName: tableName,
                    Item: {
                        PK: `CONID#${connectionId}`,
                        SK: "DEFAULT",
                        publicationId,
                    }
                }
            },
            {
                Put: {
                    TableName: tableName,
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
