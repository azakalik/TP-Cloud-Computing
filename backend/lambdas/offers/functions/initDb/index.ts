import { offersHandler } from "@shared/mainHandler";
import fs from 'fs/promises';

const tableName = 'offers';
const sqlFilePath = './offers.sql';

const readSqlFile = async (): Promise<string> => {
    const sql = await fs.readFile(sqlFilePath, 'utf8');
    if (!sql) {
        throw new Error('SQL file not found');
    }
    return sql;
};
    

export const handler = offersHandler(async (client) => {
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
        console.info("Offers tables already exists");
        return {
            statusCode: 200,
            body: {message: 'Table already exists'},
        };
    }

    // Create the tables
    const sql = await readSqlFile();
    await client.query(sql);

    console.info("Offers tables created");
    return {
        statusCode: 201,
        body: {message: 'Table created'},
    };
});