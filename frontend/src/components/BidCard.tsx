import React from 'react';
import { Card, Image, Text, Group, Badge, Button } from '@mantine/core';
import { IconClock } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

interface BidCardProps {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  countryFlag: string;
  initialPrice: string;
  initialTime: string;
  endTime: string;
}

const BidCard: React.FC<BidCardProps> = ({
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
    navigate(`/bid/${id}`);
  };

  const handleBidNowClick = () => {
    // You can handle the "Bid now" action here, like showing a bid form or modal
    alert(`Bid placed for: ${title}`);
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section>
        <Image src={imageUrl} height={160} alt={title} />
      </Card.Section>

      <Group position="apart" mt="md" mb="xs">
        <Text weight={500}>{title}</Text>
        <Badge color="blue" variant="light">
          {countryFlag}
        </Badge>
      </Group>

      <Text size="sm" color="dimmed">
        {description}
      </Text>

      <Group mt="md" position="apart">
          <Text size="sm">Initial Price: {initialPrice}</Text>
      </Group>

      <Group mt="md" position="apart">
        <Button color="blue" size="xs" onClick={handleBidNowClick}>
          Bid now
        </Button>
        <Button variant="outline" color="blue" size="xs" onClick={handleSeeDetailsClick}>
          See details
        </Button>
      </Group>

      <Group mt="md" spacing="xs">
        <IconClock size={16} />
        <Text size="xs">Start: {initialTime}</Text>
        <Text size="xs">End: {endTime}</Text>
      </Group>
    </Card>
  );
};

export default BidCard;
