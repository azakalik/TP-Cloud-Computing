import { HIGHEST_BID_WS_URL } from "./constants";
import HighestBidWebSocketMessage from "../../shared_types/HighestBidWebSocketMessage";
import { Auth } from "aws-amplify";

type SetHighestBid = (bid: number) => void;
type SetUserId = (userId: string) => void;

export async function createHighestBidWebsocket(
  setHighestBid: SetHighestBid,
  setUserId: SetUserId,
  publicationId: string, // Accept publicationId as a parameter
  url: string = HIGHEST_BID_WS_URL
): Promise<WebSocket> {
  // Append publicationId as a query parameter to the WebSocket URL
  let char;
  if (url.includes("?")) {
    char = "&";
  } else {
    char = "?";
  }

  // Retrieve the current session and JWT token
  const session = await Auth.currentSession();
  const token = session.getIdToken().getJwtToken();

  const publicationIdParam = `publicationId=${encodeURIComponent(publicationId)}`
  const authorizationParam = `Authorization=${encodeURIComponent(token)}`
  const userIdParam = `userId=22` // TODO: delete

  const wsUrlWithParams = `${url}${char}${publicationIdParam}&${authorizationParam}&${userIdParam}`;
  

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
