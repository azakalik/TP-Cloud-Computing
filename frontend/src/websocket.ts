import { HIGHEST_BID_WS_URL } from "./constants";

type HighestBidWebSocketMessage = {
  highestBid: number;
  userId: string;
};

type SetHighestBid = (bid: number) => void;
type SetUserId = (userId: string) => void;

export function createHighestBidWebsocket(
  setHighestBid: SetHighestBid,
  setUserId: SetUserId,
  publicationId: string, // Accept publicationId as a parameter
  url: string = HIGHEST_BID_WS_URL
): WebSocket {
  // Append publicationId as a query parameter to the WebSocket URL
  let char;
  if (url.includes("?")) {
    char = "&";
  } else {
    char = "?";
  }

  const wsUrlWithParams = `${url}${char}publicationId=${encodeURIComponent(
    publicationId
  )}`;
  

  const websocket = new WebSocket(wsUrlWithParams);

  websocket.onopen = () => {
    console.log("WebSocket connected to", wsUrlWithParams);
  };

  websocket.onmessage = (event: MessageEvent) => {
    try {
      console.log("WebSocket message received:", event.data);
      const parsedData: HighestBidWebSocketMessage = JSON.parse(event.data);
      if (parsedData.highestBid !== undefined) {
        setUserId(parsedData.userId);
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
