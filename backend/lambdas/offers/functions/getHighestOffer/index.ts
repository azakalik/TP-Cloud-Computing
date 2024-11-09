import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { offersHandler } from '@shared/mainHandler';

export const handler = (event: APIGatewayProxyEventV2) => 
    offersHandler(async (client) => {
        const {publicationId} = event.queryStringParameters;

        const result = await client.query<{price: number}>(`SELECT price FROM offers WHERE publication_id = $1 ORDER BY price DESC LIMIT 1`, [publicationId]);
        const highestOffer = result.rows[0]?.price || undefined;

        return {
            statusCode: 200,
            body: {price: highestOffer},
        };
    });