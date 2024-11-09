import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { offersHandler } from '@shared/mainHandler';
import { getHighestOffer } from '@shared/getHighestOffer';

export const handler = (event: APIGatewayProxyEventV2) => 
    offersHandler(async (client) => {
        const {publicationId} = event.queryStringParameters;

        const highestOffer = await getHighestOffer(client, publicationId);

        const price = highestOffer ? highestOffer.price : 0;

        return {
            statusCode: 200,
            body: {price},
        };
    });