// Import necessary AWS SDK v3 modules
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { ApiGatewayManagementApiClient, PostToConnectionCommand } from "@aws-sdk/client-apigatewaymanagementapi";

// Initialize DynamoDB Client
const ddbClient = new DynamoDBClient({ region: process.env.AWS_REGION });
const ddb = DynamoDBDocumentClient.from(ddbClient);

const endpoint = process.env.WS_API_GATEWAY_ENDPOINT;

// Initialize API Gateway Management API Client
const apiGatewayClient = new ApiGatewayManagementApiClient({
    endpoint
});

export const handler = async (event) => {
    // Process each SQS message in the event
    for (const record of event.Records) {
        const { publicationId, userId, price } = JSON.parse(record.body);  // Read message from SQS body
        if (!publicationId || !price) {
            console.error('Missing publicationId or price');
            continue;  // Skip this message if data is missing
        }

        const tableName = process.env.TABLE_NAME;

        try {
            // Query DynamoDB to get all connection IDs associated with the publicationId
            const queryParams = {
                TableName: tableName,
                KeyConditionExpression: 'PK = :pubId',
                ExpressionAttributeValues: {
                    ':pubId': `PUBID#${publicationId}`
                }
            };

            const data = await ddb.send(new QueryCommand(queryParams));
            const connections = data.Items;

            if (!connections || connections.length === 0) {
                console.log(`No connections found for publicationId ${publicationId}`);
                continue;  // Skip if no connections are found
            }
            
            const message = {
                highestBid: price,
                userId: userId
            };

            // Send a message to each connected client
            for (const connection of connections) {
                const connectionId = connection.SK.split('#')[1];  // Extract connectionId from SK
                
                try {
                    const postCommand = new PostToConnectionCommand({
                        ConnectionId: connectionId,
                        Data: Buffer.from(JSON.stringify(message)) // Data must be in a Buffer
                    });
                    
                    await apiGatewayClient.send(postCommand);
                    console.log(`Message sent to connection ${connectionId}`);
                } catch (err) {
                    console.error(`Error sending message to connection ${connectionId}:`, err);
                }
            }
        } catch (err) {
            console.error('Error querying DynamoDB or sending messages:', err);
        }
    }

    return {
        statusCode: 200,
        body: 'Messages processed successfully'
    };
};
