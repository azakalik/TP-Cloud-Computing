import BidsContainer from '../components/BidsContainer';

const fakeBids = [
  {
    id: '1',
    imageUrl: 'https://via.placeholder.com/300',
    title: 'Luxury Watch',
    description: 'A high-end luxury watch with diamonds and gold.',
    countryFlag: '🇨🇭',
    initialPrice: '$500',
    lastBid: '$800',
    initialTime: '2024-09-21 10:00 AM',
    endTime: '2024-09-25 10:00 AM',
  },
  {
    id: '2',
    imageUrl: 'https://via.placeholder.com/300',
    title: 'Vintage Car',
    description: 'Classic vintage car from the 1960s.',
    countryFlag: '🇺🇸',
    initialPrice: '$10,000',
    lastBid: '$15,000',
    initialTime: '2024-09-20 09:00 AM',
    endTime: '2024-09-30 09:00 AM',
  },
  {
    id: '3',
    imageUrl: 'https://via.placeholder.com/300',
    title: 'Antique Furniture',
    description: 'Beautiful antique furniture set from the 1800s.',
    countryFlag: '🇫🇷',
    initialPrice: '$2,000',
    lastBid: '$2,500',
    initialTime: '2024-09-22 12:00 PM',
    endTime: '2024-09-28 12:00 PM',
  },
  // Add more bids as needed
];

const ListAuctionsPage = () => {
  return (
    <div>
      <BidsContainer pageTitle='Available Bids' bids={fakeBids} />
    </div>
  );
};

export default ListAuctionsPage;
