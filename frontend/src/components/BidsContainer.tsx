import React from "react";
import { Flex, Title } from "@mantine/core";
import BidCard from "./AuctionCard";
import AuctionCardType from "../../../shared_types/AuctionCardType";

interface BidsContainerProps {
  pageTitle: string;
  auctions: AuctionCardType[];
}

const BidsContainer: React.FC<BidsContainerProps> = ({
  pageTitle,
  auctions: bids,
}) => {
  return (
    <>
      <Flex justify="center" align="center" direction="column" h={'100%'}>
        <Title order={1} mb="20">
          {pageTitle}
        </Title>
        <Flex
          gap="md"
          justify="center"
          align="start"
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
              user={bid.user}
            />
          ))}
        </Flex>
      </Flex>
    </>
  );
};

export default BidsContainer;
