import { Client } from "pg";
import { BalanceTable } from "./balanceTable";

const tableName = "balance";

export const getUserBalance = async (client: Client, userId: string): Promise<BalanceTable | null> => {
    const userResult = await client.query<BalanceTable>(
        `SELECT *
        FROM ${tableName}
        WHERE user_id = $1;`,
        [userId]
    );

    return userResult.rows.length > 0 ? userResult.rows[0] : null;
}