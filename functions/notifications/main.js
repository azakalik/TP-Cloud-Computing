// Import necessary AWS SDK v3 modules
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { ApiGatewayManagementApiClient, PostToConnectionCommand } from "@aws-sdk/client-apigatewaymanagementapi";

// Initialize DynamoDB Client
const ddbClient = new DynamoDBClient({ region: 'us-east-1' });
const ddb = DynamoDBDocumentClient.from(ddbClient);

// Initialize API Gateway Management API Client
const apiGatewayClient = new ApiGatewayManagementApiClient({
    endpoint: 'https://p08scbd5oj.execute-api.us-east-1.amazonaws.com/production' // Replace with your API Gateway WebSocket endpoint
});

export const handler = async (event) => {
    // Process each SQS message in the event
    for (const record of event.Records) {
        const { publicationId, userId, price } = JSON.parse(record.body);  // Read message from SQS body

        if (!publicationId || !price) {
            console.error('Missing publicationId or price');
            continue;  // Skip this message if data is missing
        }

        try {
            // Query DynamoDB to get all connection IDs associated with the publicationId
            const queryParams = {
                TableName: 'USER_SESSIONS',
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

            // Message to be sent (e.g., the price)
            const message = `New price: ${price}`;

            // Send a message to each connected client
            for (const connection of connections) {
                const connectionId = connection.SK.split('#')[1];  // Extract connectionId from SK
                
                try {
                    const postCommand = new PostToConnectionCommand({
                        ConnectionId: connectionId,
                        Data: Buffer.from(message)  // Convert message to a buffer
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
