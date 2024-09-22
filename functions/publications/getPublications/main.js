import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";

const dynamoDB = new DynamoDBClient({ region: "your-region" });

exports.handler = async (event) => {
    // Extract the publicationId from query string parameters
    const publicationId = event.queryStringParameters?.publicationId;

    if (!publicationId) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Missing publicationId parameter" }),
        };
    }

    // Define the key for querying DynamoDB (PK is the publication ID)
    const params = {
        TableName: "your-table-name",
        Key: {
            PK: { S: `PUBID#${publicationId}` },
            SK: { S: `PUBID#${publicationId}` } // assuming SK is set the same as PK
        }
    };

    try {
        // Query DynamoDB
        const data = await dynamoDB.send(new GetItemCommand(params));

        // Check if the item exists
        if (!data.Item) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: "Publication not found" }),
            };
        }

        // Format the response by converting DynamoDB format to JSON
        const publication = {
            user: data.Item.User.S,
            initialPrice: parseFloat(data.Item.InitialPrice.N),
            dueTime: data.Item.DueTime.S,
            title: data.Item.Title.S,
            description: data.Item.Description.S,
            created: data.Item.Created.S,
        };

        return {
            statusCode: 200,
            body: JSON.stringify(publication),
        };

    } catch (error) {
        console.error("Error retrieving data:", error);

        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Error retrieving publication", error }),
        };
    }
};
