const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const { v4: uuidv4 } = require("uuid");

// Initialize clients
const dynamoDB = new DynamoDBClient({ region: "us-east-1" });
const s3 = new S3Client({ region: "us-east-1" });

exports.handler = async (event) => {
    
    let publicationId, createdTime, dueTimeISO, item1, item2, item3, imageUrl;
    
    try {
        // Parse incoming JSON (containing image as base64, filename, and other data)
        const { user, initialPrice, dueTime, title, description, image, filename } = JSON.parse(event.body);

        // Generate unique publication ID and timestamps
        publicationId = `PUBID#${uuidv4()}`;
        createdTime = new Date().toISOString();
        dueTimeISO = new Date(dueTime).toISOString();
        
        // Decode base64 image data
        const buffer = Buffer.from(image, "base64");

        // S3 upload parameters with public-read ACL for access
        const bucketName = "ezauction-publication-images";
        const s3Params = {
            Bucket: bucketName,
            Key: filename,  // The file name in S3
            Body: buffer,
            ContentEncoding: "base64",  // Important for base64-encoded files
            ContentType: "image/jpeg",   // Adjust based on your image type
            ACL: "public-read"  // Make the object publicly accessible
        };
        
        // Upload image to S3
        await s3.send(new PutObjectCommand(s3Params));

        // Construct the URL of the uploaded image
        imageUrl = `https://${bucketName}.s3.amazonaws.com/${filename}`;

        // Prepare DynamoDB item with image URL
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
                Created: { S: createdTime },
                Image: { S: imageUrl }  // Store image URL in DynamoDB
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
                Created: { S: createdTime },
                Image: { S: imageUrl }
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
                Created: { S: createdTime },
                Image: { S: imageUrl }
            }
        };

    } catch (error) {
        console.error(error);
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Could not process the input data", error })
        };
    }

    try {
        // Insert the items into DynamoDB
        await dynamoDB.send(new PutItemCommand(item1));
        await dynamoDB.send(new PutItemCommand(item2));
        await dynamoDB.send(new PutItemCommand(item3));

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Data inserted and image uploaded successfully!", imageUrl })
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Error inserting data into DynamoDB", error })
        };
    }
};
