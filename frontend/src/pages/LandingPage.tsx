import React, { useState } from 'react';
import { Button, Container, Group, Text, Modal, TextInput, PasswordInput, Title, Stack, Image } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

const LandingPage = () => {
  const [modalOpened, { open, close }] = useDisclosure(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  return (
    <>
      {/* Navbar */}
      <nav>
        <Container size="lg" py="md">
          <Group position="apart" align="center">
            {/* Display user info or sign-in/sign-up buttons */}
            {isLoggedIn ? (
              <Text size="lg" weight={500}>{`Welcome, ${userName}`}</Text>
            ) : (
              <Text size="lg" weight={500}>Welcome to eZAuction</Text>
            )}
            {/* Sign in/Sign up button */}
            <Button variant="outline" color="blue" onClick={open}>
              Sign In / Sign Up
            </Button>
          </Group>
        </Container>
      </nav>

      {/* Hero Section */}
      <section style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'url(/auction-background.jpg) center/cover no-repeat' }}>
        <Container size="lg">
          <Stack align="center" spacing="xl">
            <Title order={1} color="white">
              Welcome to eZAuction
            </Title>
            <Text color="white" size="lg">
              Discover and bid on amazing items from various categories. Join the auction fun today!
            </Text>
            <Image src="/hero-image.png" alt="Auction" width={500} radius="md" />
            <Button variant="gradient" gradient={{ from: 'blue', to: 'cyan' }} size="lg" onClick={open}>
              Get Started
            </Button>
          </Stack>
        </Container>
      </section>

      {/* Sign In/Sign Up Modal */}
      <Modal opened={modalOpened} onClose={close} title="Sign In or Sign Up" centered>
        <Stack spacing="md">
          <TextInput label="Email" placeholder="your@email.com" required />
          <PasswordInput label="Password" placeholder="Your password" required />
          <Group position="right" mt="md">
            <Button onClick={() => { setIsLoggedIn(true); setUserName('John Doe'); close(); }}>
              Sign In
            </Button>
            <Button variant="light" onClick={close}>
              Cancel
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
};

export default LandingPage;
