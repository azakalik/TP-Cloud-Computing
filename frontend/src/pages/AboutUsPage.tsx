import { Flex, Text, Title, Paper, Image, Group, Divider } from "@mantine/core";

export default function AboutUsPage() {
  return (
    <Flex justify="center" align="center" direction="column" p="xl" style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Paper
        shadow="md"
        p="xl"
        radius="md"
        style={{ width: "100%", maxWidth: "800px", backgroundColor: '#fff' }}
      >
        <Title order={1} mb="lg" style={{ fontFamily: 'Roboto, sans-serif', color: '#2c3e50' }}>
          About Us
        </Title>
        <Divider size="sm" color="gray" mb="lg" />

        <Group mb="lg">
          <Image
            radius="md"
            src="https://www.clementsauctions.com/wp-content/uploads/2017/11/auction.jpg"
            alt="Team Photo"
            width={150}
          />
        </Group>

        <Text size="lg" color="dimmed" mb="lg">
          Welcome to our About Us page! We are a team of passionate individuals committed to delivering
          high-quality solutions. Our mission is to innovate and bring great products to the world, while
          building strong, collaborative relationships with our clients.
        </Text>

        <Text size="md" color="dimmed">
          Our team values creativity, dedication, and excellence, striving to improve and grow together with
          every challenge we encounter.
        </Text>

        <Text mt="lg" color="dimmed" size="sm">
          © 2024 Our Company. All rights reserved.
        </Text>
      </Paper>
    </Flex>
  );
}
