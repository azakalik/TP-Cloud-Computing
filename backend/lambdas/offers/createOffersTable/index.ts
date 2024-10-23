import { SecretsManager } from "aws-sdk";
import fs from "fs/promises";
import { Client } from "pg";

type DbCredentials = {
    password: string;
    username: string;
    port: number;
    dbname: string;
};

const region = 'us-east-1';
const tableName = 'offers';

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

export const handler = async () => {
    let dbCredentials: DbCredentials;

    const secretName = process.env.SECRET_NAME;
    console.log("!!!!!!getting DB credentials from secret: ", secretName);
    try {
        dbCredentials = await getDbCredentials(secretName);
    } catch (error) {
        console.error('Error while getting secret', error);
        return {
            statusCode: 500,
            body: JSON.stringify({error: 'Internal server error'}),
        };
    }
    console.log("!!!!!!Got credentials: ", dbCredentials);
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
    console.log("!!!!!!Connecting to psg");
    try {
        // Connect to the database and start a transaction
        await client.connect();
        console.log("!!!!!!Connected to psg");
        await client.query('BEGIN');

        // Check if the table already exists
        const checkTableQuery = `
            SELECT EXISTS (
                SELECT 1
                FROM pg_tables
                WHERE tablename = $1
            );
        `;
        const res = await client.query<{exists: boolean}>(checkTableQuery, [tableName]);
        const tableExists = res.rows[0].exists;

        if (tableExists) {
            console.info(`Table ${tableName} already exists`);
            return {
                statusCode: 200,
                body: JSON.stringify({message: 'Table already exists'}),
            };
        }

        // Create the table
        const createTableQuery = `
            CREATE TABLE ${tableName} (
                offer_id UUID PRIMARY KEY,
                publication_id VARCHAR NOT NULL,
                user_id VARCHAR NOT NULL,
                price NUMERIC NOT NULL,
                time TIMESTAMP NOT NULL,
                CONSTRAINT offers_pub_user_time_unique UNIQUE (publication_id, user_id, time),
                CONSTRAINT offers_pub_price_unique UNIQUE (publication_id, price)
            );
        `;
        console.log(createTableQuery)
        await client.query(createTableQuery);

        // Commit the transaction
        await client.query('COMMIT');

        console.info(`Table ${tableName} created`);
        return {
            statusCode: 201,
            body: JSON.stringify({message: 'Table created'}),
        };
    } catch (error) {
        console.error('Error while creating table', error);
        await client.query('ROLLBACK');
        return {
            statusCode: 500,
            body: JSON.stringify({error: 'Internal server error'}),
        };
    } finally {
        await client.end();
    }
};