import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  Image,
  Text,
  Group,
  Badge,
  Button,
  Container,
  Title,
  Stack,
  Grid,
  Divider,
} from "@mantine/core";
import { IconClock, IconMoneybag } from "@tabler/icons-react";
import { fetchAuctionDetail } from "../api";
import AuctionDetailType from "../types/AuctionDetailType";

const AuctionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Grab the bid id from the URL
  const [auctionDetail, setAuctionDetail] = useState<AuctionDetailType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAuctionDetail(id!).then((data) => {
      setAuctionDetail(data);
      setLoading(false);
    }); // Fetch the bid details when the component mounts
  }, [id]);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (!auctionDetail) {
    return <Text>Bid not found!</Text>;
  }

  return (
    <Container mb='30'>
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Grid align="center">
          <Grid.Col span={4.5}>
            <Image src={auctionDetail.imageUrls} alt={auctionDetail.title} />
          </Grid.Col>
          <Grid.Col span={0.5} />
          <Grid.Col span={7}>
            <Group mt="md" mb="xs">
              <Title>{auctionDetail.title}</Title>
              <Badge color="blue" variant="light">
                {auctionDetail.countryFlag}
              </Badge>
            </Group>

            <Text size="md" color="dimmed" style={{ lineHeight: 1.8 }}>
              {auctionDetail.description}
            </Text>

            <Divider my="lg" />

            <Grid>
              <Grid.Col span={6}>
                <Stack align="center" spacing={5}>
                  <IconMoneybag size={32} color="#27AE60" />
                  <Text size="lg" weight={600} color="#27AE60">
                    Initial Price
                  </Text>
                  <Text size="lg">${auctionDetail.initialPrice}</Text>
                </Stack>
              </Grid.Col>

              <Grid.Col span={6}>
                <Stack align="center" spacing={5}>
                  <IconMoneybag size={32} color="#F39C12" />
                  <Text size="lg" weight={600} color="#F39C12">
                    Last Bid
                  </Text>
                  <Text size="lg">${auctionDetail.lastBid}</Text>
                </Stack>
              </Grid.Col>

              <Grid.Col span={12}>
                <Divider my="lg" />
              </Grid.Col>

              <Grid.Col span={6}>
                <Stack align="center" spacing={5}>
                  <IconClock size={32} color="#0984e3" />
                  <Text size="lg" weight={600} color="#0984e3">
                    Start Date
                  </Text>
                  <Text size="lg">{auctionDetail.initialTime}</Text>
                </Stack>
              </Grid.Col>

              <Grid.Col span={6}>
                <Stack align="center" spacing={5}>
                  <IconClock size={32} color="#d63031" />
                  <Text size="lg" weight={600} color="#d63031">
                    End Date
                  </Text>
                  <Text size="lg">{auctionDetail.endTime}</Text>
                </Stack>
              </Grid.Col>
            </Grid>

            <Divider my="lg" />

            {/* Call to Action */}
            <Button
              size="xl"
              radius="xl"
              fullWidth
              style={{
                background: "linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)",
                fontWeight: "bold",
                fontSize: "18px",
                padding: "12px 40px",
              }}
            >
              Bid Now
            </Button>
          </Grid.Col>
        </Grid>
      </Card>
    </Container>
  );
};

export default AuctionDetailPage;
