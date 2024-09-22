import AuctionCardType from './types/AuctionCardType';
import AuctionDetailType from './types/AuctionDetailType';

const fakeAuctions: AuctionCardType[] = [
  {
    id: '1',
    imageUrl: 'https://via.placeholder.com/300',
    title: 'Luxury Watch',
    description: 'A high-end luxury watch with diamonds and gold.',
    countryFlag: '🇨🇭',
    initialPrice: '$500',
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
    initialTime: '2024-09-20 09:00 AM',
    endTime: '2024-09-30 09:00 AM',
  },
  {
   id: '4',
   imageUrl: 'https://via.placeholder.com/300',
   title: 'Modern Art Piece',
   description: 'An abstract painting by a famous contemporary artist.',
   countryFlag: '🇪🇸',
   initialPrice: '$3,000',
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
   initialTime: '2024-09-15 09:00 AM',
   endTime: '2024-09-22 09:00 AM',
 },
  // Add more items as needed
];

const fakeUserAuctions: AuctionCardType[] = [
   {
     id: '7',
     imageUrl: 'https://via.placeholder.com/300',
     title: 'Exotic Beach Resort Stay',
     description: 'A week-long stay at a luxury beach resort.',
     countryFlag: '🇹🇭',
     initialPrice: '$1,200',
     initialTime: '2024-10-01 08:00 AM',
     endTime: '2024-10-15 08:00 AM',
   },
   {
     id: '8',
     imageUrl: 'https://via.placeholder.com/300',
     title: 'Fine Wine Collection',
     description: 'A selection of rare wines from around the world.',
     countryFlag: '🇫🇷',
     initialPrice: '$800',
     initialTime: '2024-10-02 03:00 PM',
     endTime: '2024-10-10 03:00 PM',
   },
   {
     id: '9',
     imageUrl: 'https://via.placeholder.com/300',
     title: 'Luxury Yacht Experience',
     description: 'A day on a luxury yacht with gourmet dining.',
     countryFlag: '🇮🇹',
     initialPrice: '$5,000',
     initialTime: '2024-10-05 11:00 AM',
     endTime: '2024-10-12 11:00 AM',
   },
   {
     id: '10',
     imageUrl: 'https://via.placeholder.com/300',
     title: 'High-End Camera Kit',
     description: 'A professional camera kit for photography enthusiasts.',
     countryFlag: '🇯🇵',
     initialPrice: '$1,500',
     initialTime: '2024-10-03 01:00 PM',
     endTime: '2024-10-08 01:00 PM',
   },
   {
     id: '11',
     imageUrl: 'https://via.placeholder.com/300',
     title: 'Concert VIP Tickets',
     description: 'Two VIP tickets to an exclusive concert.',
     countryFlag: '🇦🇺',
     initialPrice: '$600',
     initialTime: '2024-10-04 05:00 PM',
     endTime: '2024-10-11 05:00 PM',
   },
 ];

const fakeAuctionDetail: AuctionDetailType = {
  id: '1',
  imageUrls: ['https://images-cdn.ubuy.co.in/633b8edadb0c2179127cc52b-custom-giant-luxury-wrist-watch-for.jpg', 'https://via.placeholder.com/300'],
  title: 'Luxury Watch',
  description: 'A high-end luxury watch with diamonds and gold.',
  countryFlag: '🇨🇭',
  initialPrice: '$500',
  lastBid: '$800',
  initialTime: '2024-09-21 10:00 AM',
  endTime: '2024-09-25 10:00 AM',
};

// Mock API call for auction cards
export const fetchAuctions = async (): Promise<AuctionCardType[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(fakeAuctions);
    }, 1000); // Simulating network delay
  });
};

export const fetchUserAuctions = async (): Promise<AuctionCardType[]> => {
   return new Promise((resolve) => {
      setTimeout(() => {
         resolve(fakeUserAuctions);
      }, 1000); // Simulating network delay
   });
};

// Mock API call for auction detail
export const fetchAuctionDetail = async (id: string): Promise<AuctionDetailType> => {
   console.log('fetchAuctionDetail called with id:', id);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(fakeAuctionDetail);
    }, 1000); // Simulating network delay
  });
};
