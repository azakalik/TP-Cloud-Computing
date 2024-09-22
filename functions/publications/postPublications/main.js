import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { v4 as uuidv4 } from 'uuid';

const dynamoDB = new DynamoDBClient({ region: "your-region" });

exports.handler = async (event) => {
    // Parse the incoming request body
    const { user, initialPrice, dueTime, title, description } = JSON.parse(event.body);
    
    // Generate a unique publication ID
    const publicationId = `PUBID#${uuidv4()}`;
    
    // Get the current date/time
    const createdTime = new Date().toISOString();
    
    // Convert dueTime to ISO format (if necessary)
    const dueTimeISO = new Date(dueTime).toISOString();
    
    // Define the three items to insert into DynamoDB
    const item1 = {
        TableName: "your-table-name",
        Item: {
            PK: { S: publicationId },
            SK: { S: publicationId }, // Or leave it empty if you wish
            User: { S: user },
            InitialPrice: { N: initialPrice.toString() },
            DueTime: { S: dueTimeISO },
            Title: { S: title },
            Description: { S: description },
            Created: { S: createdTime }
        }
    };

    const item2 = {
        TableName: "your-table-name",
        Item: {
            PK: { S: "STATUS#ACTIVE" },
            SK: { S: `DUE_TIME#${dueTimeISO}, PUBID#${publicationId}` },
            User: { S: user },
            InitialPrice: { N: initialPrice.toString() },
            DueTime: { S: dueTimeISO },
            Title: { S: title },
            Description: { S: description },
            Created: { S: createdTime }
        }
    };

    const item3 = {
        TableName: "your-table-name",
        Item: {
            PK: { S: "STATUS#ACTIVE" },
            SK: { S: `CREATED#${createdTime}, PUBID#${publicationId}` },
            User: { S: user },
            InitialPrice: { N: initialPrice.toString() },
            DueTime: { S: dueTimeISO },
            Title: { S: title },
            Description: { S: description },
            Created: { S: createdTime }
        }
    };
    
    // Insert all three items into DynamoDB
    try {
        await dynamoDB.send(new PutItemCommand(item1));
        await dynamoDB.send(new PutItemCommand(item2));
        await dynamoDB.send(new PutItemCommand(item3));
        
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Data inserted successfully!" })
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Error inserting data", error })
        };
    }
};
