import { Client } from "pg";
import { BalanceTable } from "./balanceTable";

const tableName = "balance";

type PgResult = {
    user_id: string;
    total: string;
    email: string;
    available: string;
}

export const getUserBalance = async (client: Client, userId: string): Promise<BalanceTable | null> => {
    const userResult = await client.query<PgResult>(
        `SELECT *
        FROM ${tableName}
        WHERE user_id = $1;`,
        [userId]
    );

    const result = userResult.rows.length > 0 ? userResult.rows[0] : null;

    return result ? {
        user_id: result.user_id,
        total: parseFloat(result.total),
        email: result.email,
        available: parseFloat(result.available),
    } : null;
}