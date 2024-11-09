import { jwtDecode, JwtPayload } from "jwt-decode";

export const getJwtPayload = async (request: Request): Promise<JwtPayload> => {
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
    const payload = await jwtDecode(jwt);
    return payload;  
}