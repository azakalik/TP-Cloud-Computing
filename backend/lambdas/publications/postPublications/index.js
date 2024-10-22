import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { v4 as uuidv4 } from "uuid";

// Initialize clients
const dynamoDB = new DynamoDBClient({ region: "us-east-1" });
const s3 = new S3Client({ region: "us-east-1" });


function getExtensionFromBase64(base64String) {
    // Extract the part before "base64," which contains the MIME type
    const mimeType = base64String.match(/^data:(.+);base64,/);
    
    // If found, split the MIME type and return the extension (e.g., "jpeg", "png")
    if (mimeType) {
        return mimeType[1].split('/')[1]; // Get the part after "image/"
    }

    return null; // Return null if the format is not correct
}


export const handler = async (event) => {
    
    let publicationId, initialTime, endTimeISO, item1, imageUrl;
    
    try {
        // Parse incoming JSON (containing image as base64, filename, and other data)
        const { user, initialPrice, endTime, title, description, images, countryFlag = "AR" } = JSON.parse(event.body); // Default country to "AR" if not provided
    
        // Generate unique publication ID and timestamps
        publicationId = `PUBID#${uuidv4()}`;
        initialTime = new Date().toISOString();
        endTimeISO = new Date(endTime).toISOString();
        
        const filename = publicationId.replace("PUBID#", "") + "_" + "0" + "." + getExtensionFromBase64(images[0])
        
        const base64Image = images[0].replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Image, "base64");
    
        // S3 upload parameters with public-read ACL for access
        const bucketName = process.env.BUCKET_NAME;
        const s3Params = {
            Bucket: bucketName,
            Key: filename,
            Body: buffer,
            ContentEncoding: "base64",
            ContentType: "image/jpeg",
            ACL: "public-read"
        };
    
        // Upload image to S3
        await s3.send(new PutObjectCommand(s3Params));
    
        // Construct the URL of the uploaded image
        imageUrl = `https://${bucketName}.s3.amazonaws.com/${filename}`;
    
        // Prepare DynamoDB item with image URL and country
        const tableName = process.env.TABLE_NAME;
        item1 = {
            TableName: tableName,
            Item: {
                PK: { S: publicationId },
                SK: { S: publicationId },
                User: { S: user },
                InitialPrice: { N: initialPrice.toString() },
                EndTime: { S: endTimeISO },
                Title: { S: title },
                Description: { S: description },
                InitialTime: { S: initialTime },
                Image: { S: imageUrl },
                CountryFlag: { S: countryFlag } // Add country field
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

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Data inserted and image uploaded successfully!", publicationId: publicationId })
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Error inserting data into DynamoDB", error })
        };
    }
};
