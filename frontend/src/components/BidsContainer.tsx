import React from 'react';
import { Flex, Title } from '@mantine/core';
import BidCard from './BidCard';

interface Bid {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  countryFlag: string;
  initialPrice: string;
  initialTime: string;
  endTime: string;
}

interface BidsContainerProps {
   pageTitle: string;
   bids: Bid[];
}

const BidsContainer: React.FC<BidsContainerProps> = ({ pageTitle, bids }) => {
  return (
   <>
      <Title order={1} mb='20'>{pageTitle}</Title>
   <Flex
   gap="md"
   justify="center"
   align="center"
   direction="row"
   wrap="wrap"
 >
   {bids.map((bid) => (
     <BidCard
       key={bid.id}
       id={bid.id}
       imageUrl={bid.imageUrl}
       title={bid.title}
       description={bid.description}
       countryFlag={bid.countryFlag}
       initialPrice={bid.initialPrice}
       initialTime={bid.initialTime}
       endTime={bid.endTime}
     />
   ))}
 </Flex>
   </>
   
  );
};

export default BidsContainer;
