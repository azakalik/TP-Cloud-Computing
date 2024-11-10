import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { DynamoDBClient, PutItemCommand, DeleteItemCommand } from "@aws-sdk/client-dynamodb";
import AWS from 'aws-sdk';
import { v4 as uuidv4 } from "uuid";
import { SNSClient, CreateTopicCommand, TagResourceCommand } from "@aws-sdk/client-sns";
import { jwtDecode } from 'jwt-decode';


// Initialize clients
const dynamoDB = new DynamoDBClient({ region: process.env.AWS_REGION });
const s3 = new S3Client({ region: process.env.AWS_REGION });
// Initialize SNS client
const snsClient = new SNSClient({ region: process.env.AWS_REGION }); // Replace with your AWS region

// Initialize EventBridge and define the rule name and target Lambda ARN
const eventbridge = new AWS.EventBridge();
const baseRuleName = 'notify-auction-end'; 
const targetLambdaArn = process.env.SEND_EMAIL_LAMBDA_ARN;
const tableName = process.env.TABLE_NAME;

const getJwtPayload = async (request) => {
    const token = request?.headers?.['authorization'];
    if (!token) {
        throw new Error('Authorization token is missing');
    }
    const regex = /Bearer (.+)/;
    const match = token.match(regex);
    if (!match) {
        throw new Error('Invalid authorization token');
    }
    const jwt = match[1];
    const payload = await jwtDecode(jwt);
    return payload;
}


function getExtensionFromBase64(base64String) {
    // Extract the part before "base64," which contains the MIME type
    const mimeType = base64String.match(/^data:(.+);base64,/);
    
    // If found, split the MIME type and return the extension (e.g., "jpeg", "png")
    if (mimeType) {
        return mimeType[1].split('/')[1]; // Get the part after "image/"
    }

    return null; // Return null if the format is not correct
}


async function createSNSTopic(publicationId) {
    try {
        // Create the SNS topic
        const createTopicCommand = new CreateTopicCommand({ Name: publicationId });
        const result = await snsClient.send(createTopicCommand);
        const topicArn = result.TopicArn;
        console.log(`SNS Topic created with ARN: ${topicArn}`);

        // Tag the topic with the publicationId
        const tagCommand = new TagResourceCommand({
            ResourceArn: topicArn,
            Tags: [{ Key: "publicationId", Value: publicationId }]
        });
        await snsClient.send(tagCommand);
        console.log(`SNS Topic tagged with publicationId: ${publicationId}`);

    } catch (error) {
        console.error("Error creating and tagging SNS Topic:", error);
    }
}



export const handler = async (event) => {
    
    let rawPublicationId, publicationId, initialTime, endTimeISO, item1, imageUrl;
    
    try {
        // Parse incoming JSON (containing image as base64, filename, and other data)
        const { user, initialPrice, endTime, title, description, images, countryFlag = "AR" } = JSON.parse(event.body); // Default country to "AR" if not provided
    
        // Generate unique publication ID and timestamps
        rawPublicationId = uuidv4()
        await createSNSTopic(rawPublicationId)
        publicationId = `PUBID#${rawPublicationId}`;
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
                CountryFlag: { S: countryFlag }// Add country field
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

    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Error inserting data into DynamoDB", error })
        };
    }

    try {
        // Schedule an EventBridge event when the publication ends
        const ruleName = `${baseRuleName}-${rawPublicationId}`;
        //const scheduleExpression = `cron(${new Date(endTimeISO).getUTCMinutes()} ${new Date(endTimeISO).getUTCHours()} ${new Date(endTimeISO).getUTCDate()} ${new Date(endTimeISO).getUTCMonth() + 1} ? ${new Date(endTimeISO).getUTCFullYear()})`;
        // create a cron job to run in 5 minutes of the lambda execution
        const scheduleExpression = `cron(${new Date().getUTCMinutes() + 2} ${new Date().getUTCHours()} ${new Date().getUTCDate()} ${new Date().getUTCMonth() + 1} ? ${new Date().getUTCFullYear()})`;
        
        // Create or update the EventBridge rule
        await eventbridge.putRule({
            Name: ruleName,
            ScheduleExpression: scheduleExpression,
            State: 'ENABLED'
        }).promise();

        await eventbridge.enableRule({ Name: ruleName }).promise();

        // Add the target Lambda function with the message as input
        await eventbridge.putTargets({
            Rule: ruleName,
            Targets: [
            {
                Id: '1',
                //Arn: targetLambdaArn,
                Arn: targetLambdaArn,
                Input: JSON.stringify({ publicationId: rawPublicationId, email: (await getJwtPayload(event)).email })
            }
            ]
        }).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Data inserted and image uploaded successfully!", publicationId: rawPublicationId })
        };
    } catch (error) {
        console.error(error);
        // remove the item from DynamoDB if the scheduling fails
        await dynamoDB.send(new DeleteItemCommand({
            TableName: tableName,
            Key: {
                PK: { S: publicationId },
                SK: { S: publicationId }
            }
        }));
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Error scheduling the closing event", error })
        };
    }
};
