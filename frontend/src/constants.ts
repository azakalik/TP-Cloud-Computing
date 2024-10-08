let stage = 'prod';  // Change this to 'prod' for production

let HIGHEST_BID_WS_URL: string;
let API_GW_URL: string;

if (stage === 'prod') {
   HIGHEST_BID_WS_URL = '';  // Set the production URL here
   API_GW_URL = '';  // Set the production URL here
} else if (stage === 'dev') {
   HIGHEST_BID_WS_URL = 'ws://localhost:8000';
   API_GW_URL = 'http://localhost:3001';
}

export { HIGHEST_BID_WS_URL, API_GW_URL };