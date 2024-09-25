import React from 'react';
import { Card, Image, Text, Group, Badge, Button } from '@mantine/core';
import { IconClock } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import AuctionCardType from '../../../shared_types/AuctionCardType';
import { displayLocalDate } from '../utils';

const BidCard: React.FC<AuctionCardType> = ({
  id,
  imageUrl,
  title,
  description,
  countryFlag,
  initialPrice,
  initialTime,
  endTime,
}) => {
  const navigate = useNavigate();

  const handleSeeDetailsClick = () => {
    navigate(`/auction/${id}`);
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section>
        <Image src={imageUrl} height={160} alt={title} />
      </Card.Section>

      <Group mt="md" mb="xs">
        <Text>{title}</Text>
        {
          countryFlag && <Badge color="blue" variant="light">
            {countryFlag}
          </Badge>
        }
      </Group>

      <Text size="sm" color="dimmed">
        {description}
      </Text>

      <Group mt="md">
          <Text size="sm">Initial Price: {initialPrice}</Text>
      </Group>

      <Group mt="md">
        <Button color="blue" size="xs" onClick={handleSeeDetailsClick}>
          See details
        </Button>
      </Group>

      <Group mt="md">
        <IconClock size={16} />
        <Text size="xs">Start: {displayLocalDate(initialTime)}</Text>
        <Text size="xs">End: {displayLocalDate(endTime)}</Text>
      </Group>
    </Card>
  );
};

export default BidCard;
