import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Image, Text, Group, Badge, Button, Container, Title } from '@mantine/core';
import { IconClock } from '@tabler/icons-react';
import { fetchAuctionDetail } from '../api';
import AuctionDetailType from '../types/AuctionDetailType';

const AuctionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Grab the bid id from the URL
  const [auctionDetail, setAuctionDetail] = useState<AuctionDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchAuctionDetail(id!).then((data) => {
      setAuctionDetail(data)
      setLoading(false)
    }); // Fetch the bid details when the component mounts
  }, [id]);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (!auctionDetail) {
    return <Text>Bid not found!</Text>;
  }

  return (
    <Container>
      <Title>{auctionDetail.title}</Title>

      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Card.Section>
          <Image src={auctionDetail.imageUrls} height={300} alt={auctionDetail.title} />
        </Card.Section>

        <Group position="apart" mt="md" mb="xs">
          <Text weight={500}>{auctionDetail.title}</Text>
          <Badge color="blue" variant="light">
            {auctionDetail.countryFlag}
          </Badge>
        </Group>

        <Text size="sm" color="dimmed">
          {auctionDetail.description}
        </Text>

        <Group mt="md" position="apart">
          <div>
            <Text size="sm">Initial Price: {auctionDetail.initialPrice}</Text>
            <Text size="sm">Last Bid: {auctionDetail.lastBid}</Text>
          </div>
        </Group>

        <Group mt="md" position="apart">
          <Button color="blue" size="md">
            Bid now
          </Button>
        </Group>

        <Group mt="md" spacing="xs">
          <IconClock size={16} />
          <Text size="xs">Start: {auctionDetail.initialTime}</Text>
          <Text size="xs">End: {auctionDetail.endTime}</Text>
        </Group>

        <Text mt="lg" size="sm">
          <strong>Description:</strong> {auctionDetail.description}
        </Text>
      </Card>
    </Container>
  );
};

export default AuctionDetailPage;
