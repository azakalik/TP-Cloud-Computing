import { BalanceTable } from '@shared/balanceTable';
import { CognitoJwtPayload, getJwtPayload } from '@shared/getJwtPayload';
import { getUserBalance } from '@shared/getUserBalance';
import { offersHandler } from '@shared/mainHandler';
import { validateBody } from '@shared/validateBody';
import { APIGatewayProxyEventV2 } from 'aws-lambda';

const tableName = "balance";

type RequestBody = {
    amount: number;
}

const asserter = (body: RequestBody): string | null => {
    if (!body) {
        return 'Offer is required';
    }
    if (!body.amount && body.amount !== 0) {
        return "Amount is required";
    }
    if (typeof body.amount !== 'number') {
        return "Amount must be a number";
    }
    if (body.amount <= 0) {
        return "Amount must be positive";
    }
    return null;
}

export const handler = async (event: APIGatewayProxyEventV2) => 
    await offersHandler(async (client) => {
        let payload: CognitoJwtPayload;

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
        const email = payload.email;

        if (!userId) {
            console.error('User ID is missing in the JWT payload');
            return {
                statusCode: 401,
                body: {error: 'Unauthorized'},
            };
        }

        if (!email) {
            console.error('Email is missing in the JWT payload');
            return {
                statusCode: 401,
                body: {error: 'Unauthorized'},
            };
        }

        const validation = validateBody(event.body, asserter);
        
        if (validation.error !== null) {
            return {
                statusCode: 400,
                body: {error: validation.error}
            };
        }

        const amount = validation.params.amount;

        const userBalance = await getUserBalance(client, userId);

        let newTotal: number;
        let newAvailable: number;

        if (userBalance) {
            const { total, available } = userBalance;
            newTotal = total + amount;
            newAvailable = available + amount;
            await client.query(`
                UPDATE ${tableName} SET total = $1, available = $2 WHERE user_id = $3
            `, [newTotal, newAvailable, userId]);
        } else {
            newTotal = amount;
            newAvailable = amount;
            await client.query(`
                INSERT INTO ${tableName} (user_id, total, email, available)
                VALUES ($1, $2, $3, $4)
            `, [userId, newTotal, email, newAvailable]);
        }

        return {
            statusCode: 200,
            body: {
                total: newTotal,
                available: newAvailable
            }
        };
    });