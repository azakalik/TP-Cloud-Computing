import BidsContainer from '../components/BidsContainer'; // Adjust the path as necessary

const myBids = [
  {
    id: '4',
    imageUrl: 'https://via.placeholder.com/300',
    title: 'Modern Art Piece',
    description: 'An abstract painting by a famous contemporary artist.',
    countryFlag: '🇪🇸',
    initialPrice: '$3,000',
    lastBid: '$4,200',
    initialTime: '2024-09-19 02:00 PM',
    endTime: '2024-09-26 02:00 PM',
  },
  {
    id: '5',
    imageUrl: 'https://via.placeholder.com/300',
    title: 'Rare Coin Collection',
    description: 'A set of rare coins from around the world.',
    countryFlag: '🇬🇧',
    initialPrice: '$1,500',
    lastBid: '$1,800',
    initialTime: '2024-09-18 11:00 AM',
    endTime: '2024-09-24 11:00 AM',
  },
  {
    id: '6',
    imageUrl: 'https://via.placeholder.com/300',
    title: 'Signed Sports Memorabilia',
    description: 'A jersey signed by a legendary football player.',
    countryFlag: '🇧🇷',
    initialPrice: '$2,500',
    lastBid: '$3,000',
    initialTime: '2024-09-15 09:00 AM',
    endTime: '2024-09-22 09:00 AM',
  },
  // Add more auctions if necessary
];

const MyAuctionsPage = () => {
  return (
    <div>
      <BidsContainer pageTitle="My Auctions" bids={myBids} />
    </div>
  );
};

export default MyAuctionsPage;
