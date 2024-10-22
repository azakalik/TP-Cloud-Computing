const { DynamoDBClient, GetItemCommand, ScanCommand } = require("@aws-sdk/client-dynamodb");

const dynamoDB = new DynamoDBClient({ region: "us-east-1" });

const handler = async (event) => {
    const publicationId = event.queryStringParameters?.publicationId;
    const tableName = process.env.TABLE_NAME;

    if (publicationId) {
        const params = {
            TableName: tableName,
            Key: {
                PK: { S: `PUBID#${publicationId}` },
                SK: { S: `PUBID#${publicationId}` } 
            }
        };

        try {
            const data = await dynamoDB.send(new GetItemCommand(params));

            if (!data.Item) {
                return {
                    statusCode: 404,
                    body: JSON.stringify({ message: "Publication not found" }),
                };
            }

            const publication = {
                user: data.Item.User.S,
                initialPrice: parseFloat(data.Item.InitialPrice.N),
                endTime: data.Item.EndTime.S,
                title: data.Item.Title.S,
                description: data.Item.Description.S,
                initialTime: data.Item.InitialTime.S,
                imageUrl: data.Item.Image.S,
                countryFlag: data.Item.CountryFlag?.S
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
    }

    // If no publicationId, use Scan to retrieve all items where PK starts with PUBID#
    const params = {
        TableName: tableName,
    };

    try {
        const data = await dynamoDB.send(new ScanCommand(params));

        if (data.Items.length === 0) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: "No publications found" }),
            };
        }

        const publications = data.Items.map(item => ({
            user: item.User.S,
            initialPrice: parseFloat(item.InitialPrice.N),
            endTime: item.EndTime.S,
            title: item.Title.S,
            description: item.Description.S,
            initialTime: item.InitialTime.S,
            imageUrl: item.Image.S,
            id: item.PK.S.replace("PUBID#", ""),
            countryFlag: item.CountryFlag?.S
        }));

        return {
            statusCode: 200,
            body: JSON.stringify(publications),
        };

    } catch (error) {
        console.error("Error scanning data:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Error retrieving publications", error }),
        };
    }
};

module.exports = { handler };
