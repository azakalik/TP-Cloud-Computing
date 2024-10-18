// Import necessary clients and commands from AWS SDK v3
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, DeleteCommand } from '@aws-sdk/lib-dynamodb';

// Initialize DynamoDB Client
const ddbClient = new DynamoDBClient({ region: process.env.AWS_REGION });  // Replace with your region
const ddb = DynamoDBDocumentClient.from(ddbClient);

export const handler = async (event) => {
    const { requestContext } = event;

    // Extract connectionId from the WebSocket request context
    const connectionId = requestContext.connectionId;

    const tableName = process.env.TABLE_NAME;

    // Define the delete parameters using the partition key (PK)
    const deleteParams = {
        TableName: tableName,  // Replace with your DynamoDB table name
        Key: {
            PK: `CONID#${connectionId}`,  // Use the correct partition key
            SK: `DEFAULT`
        },
        ReturnValues: 'ALL_OLD'  // This will return the deleted item's attributes
    };

    let publicationId = null
    try {
        // Delete the item and return its attributes
        const deletedObject = await ddb.send(new DeleteCommand(deleteParams));
        
        // Extract the publicationId from the deleted item
        publicationId = deletedObject.Attributes?.publicationId;

        if (!publicationId) {
            throw new Error("Publication ID was null");
        }

        // Proceed to delete the second item based on the publicationId
        const publicationDeleteParams = {
            TableName: tableName,
            Key: {
                PK: `PUBID#${publicationId}`,
                SK: `CONID#${connectionId}`  // Use the correct sort key
            }
        };
        
        await ddb.send(new DeleteCommand(publicationDeleteParams));

        return {
            statusCode: 200,
            body: `Successfully deleted the items for connectionId ${connectionId} and publicationId ${publicationId}`
        };

    } catch (err) {
        console.log("Could not remove connectionId", connectionId, "with pubId", publicationId )
        console.error('Error processing request:', err);
        return {
            statusCode: 500,
            body: 'Error processing request: ' + JSON.stringify(err)
        };
    }
};
