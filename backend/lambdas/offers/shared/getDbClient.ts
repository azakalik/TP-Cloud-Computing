import { SecretsManager } from "aws-sdk";
import { Client } from "pg";
import fs from 'fs/promises';

type DbCredentials = {
    password: string;
    username: string;
    port: number;
    dbname: string;
};

const getDbCredentials = async (secretName: string): Promise<DbCredentials> => {
    if (!secretName) {
        throw new Error('Secret name is not provided');
    }
    const region = process.env.AWS_REGION;
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

const amazonCaPath = './amazon-root-ca.pem' as const;

export const getAmazonCa = async (): Promise<Buffer> => {
    const ca = await fs.readFile(amazonCaPath);
    if (!ca) {
        throw new Error('CA file not found');
    }
    return ca;
}

export const getDbClient = async (): Promise<Client> => {
    const secretName = process.env.SECRET_NAME;
    const host = process.env.RDS_PROXY_HOST;

    const [dbCredentials, ca] = await Promise.all([
        getDbCredentials(secretName),
        getAmazonCa(),
    ]);

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

    return client;
}