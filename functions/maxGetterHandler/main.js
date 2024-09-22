import { ApiGatewayManagementApiClient, PostToConnectionCommand } from "@aws-sdk/client-apigatewaymanagementapi";

export const handler = async (event) => {
    const { connectionId } = event;

    if (!connectionId) {
        console.error('No connectionId provided in event.');
        return {
            statusCode: 400,
            body: 'connectionId is required.'
        };
    }

    // Initialize ApiGatewayManagementApiClient
    const apiGatewayClient = new ApiGatewayManagementApiClient({
        endpoint: 'https://qtsljelgm2.execute-api.us-east-1.amazonaws.com/production/'
    });

    try {
        // Logic to process connectionId or fetch related data
        console.log(`Processing for connectionId: ${connectionId}`);

        // Example: Send a WebSocket message to the client
        const message = {
            action: 'message',
            data: `Hello, connectionId: ${connectionId}`
        };

        // Prepare the PostToConnectionCommand
        const postToConnectionCommand = new PostToConnectionCommand({
            ConnectionId: connectionId,
            Data: Buffer.from(JSON.stringify(message)) // Data must be in a Buffer
        });

        // Send the message to the WebSocket client
        await apiGatewayClient.send(postToConnectionCommand);

        console.log(`Message sent to connectionId: ${connectionId}`);

        return {
            statusCode: 200,
            body: `Successfully processed connectionId: ${connectionId}`
        };
    } catch (error) {
        console.error('Error processing connectionId:', error);
        return {
            statusCode: 500,
            body: 'Error processing connectionId: ' + JSON.stringify(error)
        };
    }
};
