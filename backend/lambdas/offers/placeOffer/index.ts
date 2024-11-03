import {Client} from 'pg';
import {SQS, SecretsManager} from 'aws-sdk';
import fs from 'fs/promises';
import { jwtDecode, JwtPayload } from 'jwt-decode';

const region = process.env.AWS_REGION;

type Request = {
    body: string;
    headers: {
        Authorization: string;
    };
}

type RequestBody = {
    publicationId: string;
    price: number;
}

type Offer = {
    publicationId: string;
    userId: string;
    price: number;
};

type DbCredentials = {
    password: string;
    username: string;
    port: number;
    dbname: string;
};

const getJwtPayload = async (request: Request): Promise<JwtPayload> => {
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

const validateBody = (body: RequestBody): string | null => {
    if (!body) {
        return 'Offer is required';
    }
    if (!body.publicationId) {
        return 'Publication ID is required';
    }
    if (!body.price) {
        return 'Price is required';
    }
    if (body.price <= 0) {
        return 'Price must be greater than 0';
    }
    return null;
}

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


export const handler = async (request: Request) => {
    let payload: JwtPayload;

    try {
        payload = await getJwtPayload(request);
    } catch (error) {
        console.error('Error while getting JWT payload', error);
        return {
            statusCode: 401,
            body: JSON.stringify({error: 'Unauthorized'}),
        };
    }

    // https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-using-the-id-token.html
    const userId = payload.sub;

    if (!userId) {
        console.error('User ID is missing in the JWT payload');
        return {
            statusCode: 401,
            body: JSON.stringify({error: 'Unauthorized'}),
        };
    }

    let requestBody: RequestBody;
    
    try {
        requestBody = JSON.parse(request.body);
    } catch (error) {
        console.error('Error while parsing event body', error);
        return {
            statusCode: 400,
            body: JSON.stringify({error: 'Invalid request body'}),
        };
    }

    const offer: Offer = {
        publicationId: requestBody.publicationId,
        userId,
        price: requestBody.price,
    };

    const error = validateBody(requestBody);
    if (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({error}),
        };
    }

    let dbCredentials: DbCredentials;

    try {
        const secretName = process.env.SECRET_NAME; 
        dbCredentials = await getDbCredentials(secretName);
    } catch (error) {
        console.error('Error while getting secret', error);
        return {
            statusCode: 500,
            body: JSON.stringify({error: 'Internal server error'}),
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
        }
    });

    try {
        // Connect to the database and start a transaction
        await client.connect();
        await client.query('BEGIN');

        const {publicationId, price} = offer;

        // Get the current highest offer for the publication
        const res = await client.query<{price: number}>(
            'SELECT price FROM offers WHERE publication_id = $1 ORDER BY price DESC LIMIT 1',
            [publicationId]
        );

        // Check if the new offer is higher than the highest offer
        const highestOffer = res.rows[0]?.price || 0;

        if (price <= highestOffer) {
            await client.query('ROLLBACK');
            return {
                statusCode: 400,
                body: JSON.stringify({error: 'Price must be higher than the highest offer'}),
            };
        }

        // Insert the new offer
        await client.query(
            `INSERT INTO offers (offer_id, publication_id, user_id, time, price)
             VALUES (gen_random_uuid(), $1, $2, NOW(), $3)`,
            [publicationId, userId, price]
        );

        // Commit the transaction
        await client.query('COMMIT');

        // Send a message to the offers queue
        const sqsUrl = process.env.SQS_URL;
        if (!sqsUrl) {
            throw new Error('SQS URL is not provided');
        }
        const sqsParams = {
            QueueUrl: sqsUrl,
            MessageBody: JSON.stringify(offer),
        };
        
        const endpoint = process.env.SQS_ENDPOINT;
        if (!endpoint) {
            throw new Error('SQS endpoint is not provided');
        }
        const sqs = new SQS({region, endpoint});
        await sqs.sendMessage(sqsParams).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({message: 'Offer placed successfully'}),
        };
    } catch (error) {
        console.error('Error while placing offer', error);
        await client.query('ROLLBACK');
        return {
            statusCode: 500,
            body: JSON.stringify({error: 'Internal server error'}),
        };
    } finally {
        await client.end();
    }
};