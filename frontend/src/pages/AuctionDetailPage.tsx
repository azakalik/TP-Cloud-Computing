import React, { useEffect, useState, useRef } from "react";
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
  Modal,
  NumberInput,
  Loader,
  ActionIcon,
} from "@mantine/core";
import { IconClock, IconMoneybag, IconBell } from "@tabler/icons-react";
import { fetchAuctionDetail, fetchAuctionInitialHighestBid, fetchIsSubscribedToSnS, postSubscriptionToSnS, uploadBid } from "../api";
import AuctionDetailType from "../../../shared_types/AuctionDetailType";
import {
  createHighestBidWebsocket,
  destroyHighestBidWebsocket,
} from "../websocket";
import { displayLocalDate } from "../utils";

const AuctionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Grab the bid id from the URL

  const [auctionDetail, setAuctionDetail] = useState<AuctionDetailType | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [bidModalOpened, setBidModalOpened] = useState<boolean>(false);
  const [minBidAmount, setMinBidAmount] = useState<number>(0);
  const [bidAmount, setBidAmount] = useState<number | string>("");
  const [uploadingBid, setUploadingBid] = useState<boolean>(false);
  const [bidSuccessful, setBidSuccessful] = useState<boolean>(false);
  const [disableBidButton, setDisableBidButton] = useState<boolean>(false);
  const [highestBid, setHighestBid] = useState<number | null>(null);
  const [highestBidUserId, setHighestBidUserId] = useState<string | null>(null);
  const [newHighestBidAnimation, setNewHighestBidAnimation] = useState<boolean>(false);
  const [isSubscribed, setisSubscribed] = useState<boolean | null>(null);
  const [emailMessage, setEmailMessage] = useState("");
  const websocketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const handleDisableBidButton = () => {
      if (typeof bidAmount === "string") {
        return true;
      }
      if (bidAmount <= minBidAmount || (auctionDetail && bidAmount < auctionDetail.initialPrice)) {
        return true;
      }
      return false;
    };
    setDisableBidButton(handleDisableBidButton());
  }, [bidAmount, minBidAmount]);

  useEffect(() => {
    if (highestBid !== null) {
      return;
    }

    fetchAuctionInitialHighestBid(id!).then((data) => {
      if (highestBid === null) {
        setHighestBid(data.price);
      }
    });
  }, [id, highestBid]);

  useEffect(() => {
    setNewHighestBidAnimation(true);
    const timer = setTimeout(() => setNewHighestBidAnimation(false), 500);
    return () => clearTimeout(timer);
  }, [highestBid]);

  useEffect(() => {
    if (auctionDetail) {
      return;
    }
    fetchAuctionDetail(id!).then((data) => {
      setAuctionDetail(data);
      setLoading(false);
    });
  }, [id, auctionDetail]);

  useEffect(() => {
    if (highestBid !== null) {
      setMinBidAmount(highestBid);
    }
  }, [highestBid]);

  useEffect(() => {
    const callback = async () => {
      if (!id) {
        return;
      }

      websocketRef.current = await createHighestBidWebsocket(setHighestBid, setHighestBidUserId, id);

      return () => {
        if (websocketRef.current) {
          destroyHighestBidWebsocket(websocketRef.current);
        }
      };
    };
    callback();
  }, [id]);



  useEffect(() => {
    const checkIfisSubscribedToSnS = async () => {

      try {
        const isSubscribed = await fetchIsSubscribedToSnS(id!);
        setisSubscribed(isSubscribed);

      } catch (err) {
        console.log("Could not subscribe", err);
      }
    
    }

    checkIfisSubscribedToSnS();
  }, []);


  if (!id) {
    return <Text>Bid not found!</Text>;
  }
  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (!auctionDetail) {
    return <Text>Bid not found!</Text>;
  }

  const handleBid = async () => {
    setUploadingBid(true);
    await uploadBid(id!, bidAmount as number); // todo handle errors here
    setUploadingBid(false);
    setBidSuccessful(true);
  };

  const handleCloseModal = () => {
    setBidModalOpened(false);
    setBidAmount("");
    setBidSuccessful(false);
  };

  const handleSubscribe = async () => {
    // This is where you can add your subscription callback logic
    try {
      const isSubscribed = await postSubscriptionToSnS(id!);
      if (isSubscribed){
        setisSubscribed(isSubscribed);
        setEmailMessage("Check your email to confirm the subscription please");
      }
    } catch (err) {
      console.log(err);
      setisSubscribed(false);
    }
    
    console.log("User subscribed to notifications.");
  };

  return (
    <Container mb="30">
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Grid align="center">
          <Grid.Col span={4.5}>
            <Image src={auctionDetail.imageUrl} alt={auctionDetail.title} />
          </Grid.Col>
          <Grid.Col span={0.5} />
          <Grid.Col span={7}>
            <Group mt="md" mb="xs">
              <Title>{auctionDetail.title}</Title>
              {auctionDetail.countryFlag && (
                <Badge color="blue" variant="light">
                  {auctionDetail.countryFlag}
                </Badge>
              )}
            </Group>

            <Text size="md" color="dimmed" style={{ lineHeight: 1.8 }}>
              {auctionDetail.description}
            </Text>

            <Divider my="lg" />

            <Grid>
              <Grid.Col span={6}>
                <Stack align="center">
                  <IconMoneybag size={32} color="#27AE60" />
                  <Text size="lg" color="#27AE60">
                    Initial Price
                  </Text>
                  <Text size="lg">${auctionDetail.initialPrice}</Text>
                </Stack>
              </Grid.Col>

              <Grid.Col span={6}>
                <Stack align="center">
                  <IconMoneybag size={32} color="#F39C12" />
                  <Text size="lg" color="#F39C12">
                    Highest Bid
                  </Text>
                  <Text
                    size="lg"
                    color={newHighestBidAnimation ? "green" : ""}
                    style={{
                      transform: newHighestBidAnimation
                        ? "scale(1.2)"
                        : "scale(1)",
                      transition: "transform 0.3s ease, color 0.5s ease",
                    }}
                  >
                    {
                      highestBid ?
                        `$${highestBid}` :
                        <Loader size='md' type="dots" color="#F39C12" />
                    }

                  </Text>
                </Stack>
              </Grid.Col>

              <Grid.Col span={12}>
                <Divider my="lg" />
              </Grid.Col>

              <Grid.Col span={6}>
                <Stack align="center">
                  <IconClock size={32} color="#0984e3" />
                  <Text size="lg" color="#0984e3">
                    Start Date
                  </Text>
                  <Text size="lg">{displayLocalDate(auctionDetail.initialTime)}</Text>
                </Stack>
              </Grid.Col>

              <Grid.Col span={6}>
                <Stack align="center">
                  <IconClock size={32} color="#d63031" />
                  <Text size="lg" color="#d63031">
                    End Date
                  </Text>
                  <Text size="lg">{displayLocalDate(auctionDetail.endTime)}</Text>
                </Stack>
              </Grid.Col>
            </Grid>

            <Divider my="lg" />

            {/* Subscription Bell Icon */}
            {isSubscribed !== null &&
              <Group position="center" spacing="xs" mb="md">
                <ActionIcon
                  onClick={isSubscribed ? undefined : handleSubscribe} // Disable onClick when subscribed
                  size="xl"
                  radius="xl"
                  style={{
                    cursor: isSubscribed ? "not-allowed" : "pointer", // Change cursor to indicate clickable state
                  }}
                  disabled={isSubscribed} // Disable button when subscribed
                  
                >
                  <IconBell size={24} />
                </ActionIcon>
                <Text>{isSubscribed ? "Subscribed" : "Subscribe to notifications"}</Text>
                <Text style={{color: "green"}}>{emailMessage}</Text>
              </Group>
            }



            {/* Call to Action */}
            <Button
              size="xl"
              radius="xl"
              fullWidth
              onClick={() => setBidModalOpened(true)} // Open the modal on click
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

        {/* Modal for bidding */}
        <Modal
          opened={bidModalOpened}
          onClose={() => { }} // don't allow closing by clicking outside
          withCloseButton={false}
        >
          {bidSuccessful ? (
            <>
              <Title order={2}>Bid successful!</Title>
              <Divider my="20" />
              <Text size="lg">
                Your bid of ${bidAmount} has been successfully placed.
              </Text>
              <Group mt="md">
                <Button onClick={handleCloseModal}>Close</Button>
              </Group>
            </>
          ) : (
            <>
              <Title order={2}>Enter your bid</Title>
              <Divider my="20" />
              <NumberInput
                label="Bid Amount ($)"
                onChange={setBidAmount}
                value={bidAmount}
                placeholder="Enter amount"
                min={minBidAmount}
                prefix="$"
                allowNegative={false}
                decimalScale={2}
                decimalSeparator="."
                thousandSeparator=","
                leftSection={<IconMoneybag />}
                hideControls
                error={
                  disableBidButton && typeof bidAmount === "number"
                    ? "Bid amount must be greater than the initial price and highest bid"
                    : null
                }
              />
              <Group mt="md">
                <Button
                  variant="outline"
                  onClick={handleCloseModal}
                  disabled={uploadingBid}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleBid}
                  loading={uploadingBid}
                  disabled={disableBidButton}
                >
                  Bid
                </Button>
              </Group>
            </>
          )}
        </Modal>
      </Card>
    </Container>
  );
};

export default AuctionDetailPage;
