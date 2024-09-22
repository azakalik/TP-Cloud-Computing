import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, Image, Text, Group, Badge, Button, Container, Title } from '@mantine/core';
import { IconClock } from '@tabler/icons-react';

const fakeBidData = {
  '1': {
    imageUrl: 'https://via.placeholder.com/300',
    title: 'Luxury Watch',
    description: 'This is a high-end luxury watch with diamonds and gold. A perfect item for formal events and collectors.',
    countryFlag: '🇨🇭',
    initialPrice: '$500',
    lastBid: '$800',
    initialTime: '2024-09-21 10:00 AM',
    endTime: '2024-09-25 10:00 AM',
    details: 'This watch has been crafted by Swiss artisans. It features a sapphire crystal face and 24k gold casing.',
  },
  '2': {
    imageUrl: 'https://via.placeholder.com/300',
    title: 'Vintage Car',
    description: 'A classic vintage car from the 1960s. This car is in mint condition and has been fully restored.',
    countryFlag: '🇺🇸',
    initialPrice: '$10,000',
    lastBid: '$15,000',
    initialTime: '2024-09-20 09:00 AM',
    endTime: '2024-09-30 09:00 AM',
    details: 'The car comes with original parts and documentation. It is a collector’s item and can be driven on modern roads.',
  },
  // Add more bid details as necessary
};

const BidDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Grab the bid id from the URL
  const bid = fakeBidData[id as keyof typeof fakeBidData]; // Fetch the corresponding bid data

  if (!bid) {
    return <Text>Bid not found!</Text>;
  }

  return (
    <Container>
      <Title>{bid.title}</Title>

      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Card.Section>
          <Image src={bid.imageUrl} height={300} alt={bid.title} />
        </Card.Section>

        <Group position="apart" mt="md" mb="xs">
          <Text weight={500}>{bid.title}</Text>
          <Badge color="blue" variant="light">
            {bid.countryFlag}
          </Badge>
        </Group>

        <Text size="sm" color="dimmed">
          {bid.description}
        </Text>

        <Group mt="md" position="apart">
          <div>
            <Text size="sm">Initial Price: {bid.initialPrice}</Text>
            <Text size="sm">Last Bid: {bid.lastBid}</Text>
          </div>
        </Group>

        <Group mt="md" position="apart">
          <Button color="blue" size="md">
            Bid now
          </Button>
        </Group>

        <Group mt="md" spacing="xs">
          <IconClock size={16} />
          <Text size="xs">Start: {bid.initialTime}</Text>
          <Text size="xs">End: {bid.endTime}</Text>
        </Group>

        <Text mt="lg" size="sm">
          <strong>Details:</strong> {bid.details}
        </Text>
      </Card>
    </Container>
  );
};

export default BidDetail;
