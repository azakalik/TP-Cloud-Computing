import {ApiGatewayV2, SecretsManager} from 'aws-sdk';
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import fs from 'fs/promises';
import { Client } from 'pg';

const region = 'us-east-1';

type DbCredentials = {
    password: string;
    username: string;
    port: number;
    dbname: string;
};

const getDbCredentials = async (secretName?: string): Promise<DbCredentials> => {
    if (!secretName) {
        throw new Error('Secret name is not provided');
    }
    const secretsManager = new SecretsManager({region});
    const data = await secretsManager.getSecretValue({SecretId: secretName}).promise();
    if (!data.SecretString) {
        throw new Error('Secret string is empty or undefined');
    }
    const dataJson = JSON.parse(data.SecretString) as DbCredentials;
    return {
        password: dataJson.password,
        username: dataJson.username,
        port: dataJson.port,
        dbname: dataJson.dbname,
    };
}

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {

    const {publicationId} = event.queryStringParameters;

    let dbCredentials: DbCredentials;

    try {
        dbCredentials = await getDbCredentials(process.env.DB_SECRET_NAME);
    } catch (error) {
        console.error('Error fetching DB credentials:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({error: 'Internal server error'})
        };
    }

    const host = process.env.RDS_PROXY_HOST;
    if (!host) {
        console.error('RDS Proxy host is not provided');
        return {
            statusCode: 500,
            body: JSON.stringify({error: 'Internal server error'}),
        };
    }

    let ca: Buffer;
    try {
        ca = await fs.readFile('./amazon-root-ca.pem');
        if (!ca) {
            throw new Error('CA file not found');
        }
    } catch (error) {
        console.error('Error while reading CA file', error);
        return {
            statusCode: 500,
            body: JSON.stringify({error: 'Internal server error'}),
        };
    }

    const client = new Client({
        user: dbCredentials.username,
        host,
        database: dbCredentials.dbname,
        password: dbCredentials.password,
        port: dbCredentials.port,
        ssl: {
            ca: ca.toString(),
            rejectUnauthorized: true,
        },
    });

    let highestOffer: number | undefined;

    try {
        console.log('Connecting to database');
        await client.connect();
        console.log('Connected to database');
        const result = await client.query<{price: number}>(`SELECT price FROM offers WHERE publication_id = $1 ORDER BY price DESC LIMIT 1`, [publicationId]);
        console.log('Query result:', result.rows);
        highestOffer = result.rows[0]?.price || undefined;
    } catch (error) {
        console.error('Error fetching highest offer:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({error: 'Internal server error'}),
        };
    } finally {
        await client.end();
    }

    /* const apiGatewayEndpoint = process.env.API_GATEWAY_ENDPOINT;

    if (!apiGatewayEndpoint) {
        console.error('API_GATEWAY_ENDPOINT is not provided.');
        return {
            statusCode: 500,
            body: 'Internal server error'
        };
    }

    // Initialize ApiGatewayManagementApiClient
    const apiGatewayManagementApi = new ApiGatewayManagementApi({
        endpoint: apiGatewayEndpoint
    }); */

    try {
        /* // Example: Send a WebSocket message to the client
        const message = {
            action: 'message',
            data: {
                price: highestOffer
            }
        };

        // Prepare the PostToConnectionCommand
        const postToConnectionCommand: ApiGatewayManagementApi.Types.PostToConnectionRequest = {
            ConnectionId: connectionId,
            Data: Buffer.from(JSON.stringify(message)) // Data must be in a Buffer
        };

        console.log('Sending message to connection:', connectionId);

        // Send the message to the WebSocket client
        await apiGatewayManagementApi.postToConnection(postToConnectionCommand).promise();

        console.log('Message sent successfully'); */

        return {
            statusCode: 200,
            body: JSON.stringify({price: highestOffer})
        };
    } catch (error) {
        console.error('Error processing connectionId:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({error: 'Internal server error'})
        };
    }
};
