import { BalanceTable } from '@shared/balanceTable';
import { getJwtPayload } from '@shared/getJwtPayload';
import { getUserBalance } from '@shared/getUserBalance';
import { offersHandler } from '@shared/mainHandler';
import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { JwtPayload } from 'jwt-decode';

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

        const user = await getUserBalance(client, userId);

        return {
            statusCode: 200,
            body: {
                total: user?.total || 0,
                available: user?.available || 0
            }
        };
    });
