import { Flex } from '@mantine/core';
import BidCard from './BidCard';

const BidsContainer = () => {
   const bidData = [
      {
        id: '1',
        imageUrl: 'https://via.placeholder.com/150',
        title: 'Luxury Watch',
        description: 'A high-end luxury watch, perfect for formal events.',
        countryFlag: '🇨🇭',
        initialPrice: '$500',
        initialTime: '2024-09-21 10:00 AM',
        endTime: '2024-09-25 10:00 AM',
      },
      {
        id: '2',
        imageUrl: 'https://via.placeholder.com/150',
        title: 'Vintage Car',
        description: 'A classic vintage car in mint condition.',
        countryFlag: '🇺🇸',
        initialPrice: '$10,000',
        initialTime: '2024-09-20 09:00 AM',
        endTime: '2024-09-30 09:00 AM',
      },
      {
         id: '3',
         imageUrl: 'https://via.placeholder.com/150',
         title: 'Luxury Watch',
         description: 'A high-end luxury watch, perfect for formal events.',
         countryFlag: '🇨🇭',
         initialPrice: '$500',
         initialTime: '2024-09-21 10:00 AM',
         endTime: '2024-09-25 10:00 AM',
       },
       {
         id: '4',
         imageUrl: 'https://via.placeholder.com/150',
         title: 'Vintage Car',
         description: 'A classic vintage car in mint condition.',
         countryFlag: '🇺🇸',
         initialPrice: '$10,000',
         initialTime: '2024-09-20 09:00 AM',
         endTime: '2024-09-30 09:00 AM',
       },
      // More bids...
    ];
  
    return (
      <Flex justify="center" align="flex-start" wrap="wrap" gap="lg">
        {bidData.map((bid) => (
          <BidCard
            key={bid.id}
            id={bid.id}
            imageUrl={bid.imageUrl}
            title={bid.title}
            description={bid.description}
            countryFlag={bid.countryFlag}
            initialPrice={bid.initialPrice}
            lastBid={bid.lastBid}
            initialTime={bid.initialTime}
            endTime={bid.endTime}
          />
        ))}
      </Flex>
    );
};

export default BidsContainer;
