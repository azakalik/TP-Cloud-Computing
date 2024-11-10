import { APIGatewayProxyEventV2 } from 'aws-lambda';

type Return<T extends object> = {
    error: string | null;
    params?: T;
};

export const validateBody = <T extends object> (body: APIGatewayProxyEventV2["body"], asserter: (request: T) => string | null): Return<T> => {
    let params: T;
    
    try {
        params = JSON.parse(body);
    } catch (error) {
        console.error('Error while parsing event body', error);
        return {
            error: 'Invalid request body'
        }
    }

    const error = asserter(params);

    if (error) {
        return { error };
    }

    return {
        error: null,
        params
    };
}