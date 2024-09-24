const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { fakeAuctions, fakeUserAuctions, fakeAuctionDetail } = require('./mock_data');
const AuctionCardType = require('../../../shared_types/AuctionCardType');
const AuctionDetailType = require('../../../shared_types/AuctionDetailType');
const NewAuctionType = require('../../../shared_types/NewAuctionType');
const NewBidType = require('../../../shared_types/NewBidType');
const { v4: uuidv4 } = require('uuid'); // Using UUID for unique auction IDs

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());

// Simulate auctions fetching
app.get('/publications', (req: Request, res: Response<AuctionCardType[]>) => {
  res.json(fakeAuctions);
});

// Simulate fetching user-specific auctions
app.get('/user/publications', (req: Request, res: Response<AuctionCardType[]>) => {
  res.json(fakeUserAuctions);
});

// Simulate fetching auction details by ID
app.get('/publications/:id', (req: Request<{ id: string }>, res: Response<AuctionDetailType | string>) => {
  const { id } = req.params;
  if (id === fakeAuctionDetail.id) {
    res.json(fakeAuctionDetail);
  } else {
    res.status(404).send('Auction not found');
  }
});

// Simulate placing a bid on an auction
app.post('/publications/:id/bid', (req: Request<{ id: string }, {}, NewBidType>, res: Response) => {
  const { id } = req.params;
  const { bidAmount } = req.body;
  
  console.log(`Bid received for auction ${id} with amount ${bidAmount}`);
  
  res.status(200).send();
});

// Simulate uploading a new auction
app.post('/publications', async (req: Request<{}, {}, NewAuctionType>, res: Response) => {
  const {
    user,
    title,
    description,
    countryFlag,
    initialPrice,
    images,
    initialTime,
    endTime,
  } = req.body;

  // Create a new auction object
  const newAuction: AuctionCardType = {
    id: uuidv4(), // Generate a unique ID
    title,
    user,
    description,
    imageUrl: 'https://unsplash.com/photos/black-and-white-analog-desk-clock-at-10-10-ooPXbJ22UIk', // Use the first image for display purposes
    countryFlag,
    initialPrice,
    initialTime,
    endTime,
  };

  // Add the new auction to the mock database (fakeAuctions array)
  fakeAuctions.push(newAuction);

  console.log(`New auction created: ${title} by ${user}`);

  // For now, just respond with the created auction
  res.status(201).json(newAuction);
});

app.listen(PORT, () => {
  console.log(`Mock server running at http://localhost:${PORT}`);
});

export default app;
