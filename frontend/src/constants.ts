let stage = 'prod';  // Change this to 'prod' for production

let HIGHEST_BID_WS_URL: string;
let API_GW_URL: string;
let API_GW_BIDS_URL: string;

if (stage === 'prod') {
   HIGHEST_BID_WS_URL = '';  // Set the production URL here
   API_GW_URL = '';  // Set the production URL here
   API_GW_BIDS_URL = ''
} else if (stage === 'dev') {
   HIGHEST_BID_WS_URL = 'ws://localhost:8000';
   API_GW_URL = ''; // Set if needed
}

export { HIGHEST_BID_WS_URL, API_GW_URL };