import { Client } from "pg";
import { getDbClient } from "./getDbClient";

type Response = {
    statusCode: number;
    body: object;
};

export const offersHandler = async (fn: (client: Client) => Promise<Response>) => {
    let client: Client | undefined = undefined;

    try {
        client = await getDbClient();
        await client.connect();
        await client.query('BEGIN');
        const result = await fn(client);
        await client.query('COMMIT');
        return {
            statusCode: result.statusCode,
            body: JSON.stringify(result.body),
        }
    } catch (error) {
        console.error('Error:', error);
        await client?.query('ROLLBACK');
        return {
            statusCode: 500,
            body: JSON.stringify({message: 'Internal server error'}),
        };
    } finally {
        await client?.end();
    }
};