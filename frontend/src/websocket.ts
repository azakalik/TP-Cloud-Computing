import { HIGHEST_BID_WS_URL } from "./constants";

type WebSocketMessage = {
  highestBid?: number; // Adjust this based on the expected data structure from your WebSocket
};

type SetHighestBid = (bid: number) => void;

export function createHighestBidWebsocket(
  setHighestBid: SetHighestBid,
  publicationId: string, // Accept publicationId as a parameter
  url: string = HIGHEST_BID_WS_URL
): WebSocket {
  // Append publicationId as a query parameter to the WebSocket URL
  const wsUrlWithParams = `${url}?publicationId=${encodeURIComponent(
    publicationId
  )}`;

  const websocket = new WebSocket(wsUrlWithParams);

  websocket.onopen = () => {
    console.log("WebSocket connected to", wsUrlWithParams);
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
    console.log("WebSocket connection closed.");
  };

  websocket.onerror = (error: Event) => {
    console.error("WebSocket error:", error);
    websocket?.close(); // Close the connection on error
  };

  return websocket;
}

export function destroyHighestBidWebsocket(websocket: WebSocket): void {
  // Cleanup WebSocket connection
  console.log("Closing WebSocket connection...");
  websocket.close();
}
