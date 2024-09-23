const WebSocket = require('ws');
const http = require('http');

// Create an HTTP server to attach the WebSocket to
const server = http.createServer();
const wss = new WebSocket.Server({ server });

// Initialize variables
const initialHighestBid = 1000;
const updateInterval = 5; // in seconds
let highestBid = initialHighestBid;
let clientsConnected = 0;
let intervalId;

// Function to increase the bid
function updateBid() {
    console.log(`clientsConnected: ${clientsConnected}`);
    if (clientsConnected > 0) {
        const randomIncrease = Math.floor(Math.random() * 101); // Random number between 0 and 100
        highestBid += randomIncrease;
        console.log(`sending highestBid: ${highestBid}`);

        // Broadcast highestBid to all connected clients
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ highestBid }));
            }
        });
    }
}

// When a client connects to the WebSocket
wss.on('connection', (ws, req) => {
    const ip = req.socket.remoteAddress;
    const port = req.socket.remotePort;

    // Extract publicationId from the query parameters
    const urlParams = new URLSearchParams(req.url.split('?')[1]);
    const publicationId = urlParams.get('publicationId');

    console.log(`new connection: ${ip}:${port}, publicationId: ${publicationId}`);

    clientsConnected++;
    
    // Start updating bid every 10 seconds if it's the first client
    if (clientsConnected === 1) {
        highestBid = initialHighestBid; // Reinitialize bid when a new client connects
        console.log(`highestBid: ${highestBid}`);
        intervalId = setInterval(updateBid, updateInterval * 1000);
    }

    // When the client disconnects
    ws.on('close', () => {
        console.log(`client disconnected: ${ip}:${port}`);
        clientsConnected--;

        // Stop the interval and reset highestBid if no clients are connected
        if (clientsConnected === 0) {
            clearInterval(intervalId);
            highestBid = initialHighestBid;
            console.log(`resetting highestBid to: ${highestBid}`);
        }
    });
});

// Start the HTTP server on port 8000
server.listen(8000, () => {
    console.log('WebSocket server is running on ws://localhost:8000');
});
