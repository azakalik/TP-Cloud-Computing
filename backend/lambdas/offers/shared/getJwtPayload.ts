import { jwtDecode, JwtPayload } from "jwt-decode";

export type CognitoJwtPayload = JwtPayload & {
    email: string;
    'cognito:username': string;
    'cognito:groups'?: string[];
    email_verified: boolean;
    token_use: string;
}

export const getJwtPayload = async (request: Request): Promise<CognitoJwtPayload> => {
    const token = request?.headers?.['authorization'];
    if (!token) {
        throw new Error('Authorization token is missing');
    }
    const regex = /Bearer (.+)/;
    const match = token.match(regex);
    if (!match) {
        throw new Error('Invalid authorization token');
    }
    const jwt = match[1];
    const payload = await jwtDecode(jwt) as CognitoJwtPayload;
    return payload;  
}