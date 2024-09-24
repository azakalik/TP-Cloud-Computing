
# Mock Server for AWS Lambda and API Gateway Simulation
This is a mock server built with Express.js to simulate the behavior of AWS Lambda functions and API Gateway endpoints. The server mocks endpoints related to auctions, allowing you to test your frontend or API clients without needing to set up the full AWS Lambda backend.

## Features
- GET /publications: Fetches a list of all auctions (mocked).
- GET /user/publications: Fetches a list of auctions specific to a user (mocked).
- GET /publications/: Fetches the details of a specific auction by its ID.
- POST /publications: Simulates uploading a new auction and adds it to the in-memory database.
- POST /publications/bid: Simulates placing a bid on an auction.

## Purpose
This mock server replicates the API behavior of an auction platform backend that's deployed using AWS Lambda and API Gateway. It allows you to:

- Develop and test your frontend locally without connecting to the actual AWS infrastructure.
- Simulate the creation of auctions, fetching auction details, and placing bids.

## Getting Started
### Prerequisites
- Node.js installed on your machine (v14 or later is recommended).
- npm package manager.
### Installation
Clone this repository or copy the code to your local machine.
Run:
```bash
npm install
```
### Running the Server
To start the mock server, run:
```bash
npm start
```
This will start the server on http://localhost:3000.

### Available Endpoints
1. Fetch All Auctions
Endpoint: GET /publications

Response: Returns a list of mock auctions.

```json
[
  {
    "id": "auction-id-1",
    "title": "Auction Title 1",
    "imageUrl": "https://example.com/image1.jpg",
    "countryFlag": "🇺🇸",
    "initialPrice": 1000,
    "initialTime": "2024-09-24T10:00:00Z",
    "endTime": "2024-10-01T10:00:00Z"
  },
]
```

2. Fetch User-Specific Auctions
Endpoint: GET /user/publications

Response: Returns a list of auctions specific to the user.

```json
[
  {
    "id": "auction-id-2",
    "title": "User Auction Title",
    "imageUrl": "https://example.com/image2.jpg",
    "countryFlag": "🇬🇧",
    "initialPrice": 1500,
    "initialTime": "2024-09-22T08:00:00Z",
    "endTime": "2024-09-29T08:00:00Z"
  }
]
```

3. Fetch Auction Details
Endpoint: GET /publications/:id

Parameters:

id: The unique identifier of the auction.
Response: Returns details of the specified auction or a 404 error if not found.

```json
{
  "id": "auction-id-1",
  "title": "Auction Title 1",
  "description": "A description of the auction...",
  "initialPrice": 1000,
  "countryFlag": "🇺🇸",
  "initialTime": "2024-09-24T10:00:00Z",
  "endTime": "2024-10-01T10:00:00Z",
  "images": ["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
}
```

4. Create a New Auction
Endpoint: POST /publications

Body Parameters:

```json
{
  "user": "JohnDoe",
  "title": "New Auction Title",
  "description": "Description of the new auction",
  "countryFlag": "🇫🇷",
  "initialPrice": 5000,
  "images": ["https://example.com/image1.jpg"],
  "initialTime": "2024-09-24T10:00:00Z",
  "endTime": "2024-10-01T10:00:00Z"
}
```
Response: Returns the newly created auction object and adds it to the in-memory database.

```json
{
  "id": "unique-auction-id",
  "title": "New Auction Title",
  "imageUrl": "https://example.com/image1.jpg",
  "countryFlag": "🇫🇷",
  "initialPrice": 5000,
  "initialTime": "2024-09-24T10:00:00Z",
  "endTime": "2024-10-01T10:00:00Z"
}
```

5. Place a Bid on an Auction
Endpoint: POST /publications/:id/bid

Parameters:

id: The unique identifier of the auction.
Body:

```json
{
  "bidAmount": 6000
}
```

Response: Returns 200 status indicating the bid was received successfully.

### Modifying Mock Data
If you want to change the mock data, you can edit the fakeAuctions, fakeUserAuctions, and fakeAuctionDetail arrays in the mock_data.ts file.

### Mock Data
fakeAuctions: An array of mock auctions that simulates the auctions available on the platform.
fakeUserAuctions: A subset of auctions specific to a particular user.
fakeAuctionDetail: Detailed information for a specific auction.
You can customize the data in the mock_data.ts file to suit your development or testing needs.

## License
This project is licensed under the MIT License.

