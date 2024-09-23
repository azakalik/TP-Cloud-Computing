type WebSocketMessage = {
  highestBid?: number; // Adjust this based on the expected data structure from your WebSocket
};

type SetHighestBid = (bid: number) => void;

function createHighestBidWebsocket(
  url: string,
  setHighestBid: SetHighestBid,
  reconnectInterval: number = 5000
): () => void {
  let websocket: WebSocket | null = null;
  let reconnectTimeout: number | null = null;

  const connectWebSocket = () => {
    websocket = new WebSocket(url);

    websocket.onopen = () => {
      console.log("WebSocket connected");
    };

    websocket.onmessage = (event: MessageEvent) => {
      try {
        const parsedData: WebSocketMessage = JSON.parse(event.data);
        if (parsedData.highestBid !== undefined) {
          setHighestBid(parsedData.highestBid);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    websocket.onclose = () => {
      console.log("WebSocket connection closed. Attempting to reconnect...");
      attemptReconnect();
    };

    websocket.onerror = (error: Event) => {
      console.error("WebSocket error:", error);
      websocket?.close(); // Close the connection on error
    };
  };

  const attemptReconnect = () => {
    if (reconnectTimeout) clearTimeout(reconnectTimeout);
    reconnectTimeout = setTimeout(() => {
      connectWebSocket();
    }, reconnectInterval);
  };

  // Initiate the connection
  connectWebSocket();

  // Return a cleanup function to close WebSocket when needed
  return () => {
    if (websocket) websocket.close();
    if (reconnectTimeout) clearTimeout(reconnectTimeout);
  };
}

export default createHighestBidWebsocket;
