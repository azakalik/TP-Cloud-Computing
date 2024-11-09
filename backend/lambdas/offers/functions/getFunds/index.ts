import { BalanceTable } from '@shared/balanceTable';
import { getJwtPayload } from '@shared/getJwtPayload';
import { offersHandler } from '@shared/mainHandler';
import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { JwtPayload } from 'jwt-decode';

const tableName = "balance";

export const handler = async (event: APIGatewayProxyEventV2) => 
    await offersHandler(async (client) => {
        let payload: JwtPayload;

        try {
            payload = await getJwtPayload(event);
        } catch (error) {
            console.error('Error while getting JWT payload', error);
            return {
                statusCode: 401,
                body: {error: 'Unauthorized'},
            };
        }

        const userId = payload.sub;

        if (!userId) {
            console.error('User ID is missing in the JWT payload');
            return {
                statusCode: 401,
                body: {error: 'Unauthorized'},
            };
        }

        const userResult = await client.query<BalanceTable>(
            `SELECT *
            FROM ${tableName}
            WHERE user_id = $1;`,
            [userId]
        );

        const user = userResult.rows.length > 0 ? userResult.rows[0] : undefined;

        return {
            statusCode: 200,
            body: {
                total: user?.total || 0,
                available: user?.available || 0
            }
        };
    });
