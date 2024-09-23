const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');
const { v4: uuidv4 } = require('uuid');

const dynamoDB = new DynamoDBClient({ region: "us-east-1" });

exports.handler = async (event) => {
    
    let publicationId, createdTime, dueTimeISO, tableName, item1, item2, item3;
    try{
        const { user, initialPrice, dueTime, title, description } = JSON.parse(event.body);
        publicationId = `PUBID#${uuidv4()}`;
        createdTime = new Date().toISOString();
        dueTimeISO = new Date(dueTime).toISOString();
        tableName = "PUBLICATIONS";

        item1 = {
            TableName: "PUBLICATIONS",
            Item: {
                PK: { S: publicationId },
                SK: { S: publicationId },
                User: { S: user },
                InitialPrice: { N: initialPrice.toString() },
                DueTime: { S: dueTimeISO },
                Title: { S: title },
                Description: { S: description },
                Created: { S: createdTime }
            }
        };
    
        item2 = {
            TableName: "PUBLICATIONS",
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
    
        item3 = {
            TableName: "PUBLICATIONS",
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
    } catch (error){
        console.error(error);
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Could not read JSON data", error })
        };
    }
    

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
