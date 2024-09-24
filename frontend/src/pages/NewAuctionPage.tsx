import React, { useState } from "react";
import {
  Button,
  TextInput,
  NumberInput,
  Textarea,
  Flex,
  Grid,
  Stack,
  Paper,
  Divider,
  Title,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { FileWithPath } from "@mantine/dropzone";
import ImageDropzone from "../components/ImageDropzone";
import { uploadNewAuction } from "../api";

const AuctionForm = () => {
  const [user, setUser] = useState("");
  const [initialPrice, setInitialPrice] = useState<number | undefined>(
    undefined
  );
  const [dueTime, setDueTime] = useState<Date | null>(null); // DatePicker state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<FileWithPath[]>([]); // Accept files as a state
  // @ts-ignore
  const [countryFlag, setCountryFlag] = useState(""); // todo: add country flag

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (files.length === 0) {
      alert("Please upload at least an image");
      return;
    }

    if (!initialPrice || !dueTime) {
      alert("Please fill in all required fields");
      return;
    }

    const return_value = await uploadNewAuction(user, title, description, countryFlag, initialPrice!, files, dueTime);
    if (return_value) {
      alert("Auction created successfully!");
    } else {
      alert("Failed to create auction :(");
    }
  };

  return (
    <Flex justify="center" align="center" direction="column">
      <Title mb="10">Create new Auction</Title>
      <Paper w={"60%"} shadow="md" p="lg" mb="lg" withBorder>
        <form onSubmit={handleSubmit}>
          <Grid gutter="md">
            {" "}
            {/* Use Grid for two-column layout */}
            <Grid.Col span={7}>
              <Stack>
                <TextInput
                  label="User ID or Email"
                  placeholder="Enter user ID or email"
                  value={user}
                  onChange={(event) => setUser(event.currentTarget.value)}
                  required
                />
                <TextInput
                  label="Title"
                  placeholder="Enter title"
                  value={title}
                  onChange={(event) => setTitle(event.currentTarget.value)}
                  required
                />
                <Textarea
                  label="Description"
                  placeholder="Enter description"
                  value={description}
                  onChange={(event) =>
                    setDescription(event.currentTarget.value)
                  }
                  required
                />
                <NumberInput
                  label="Initial Price"
                  placeholder="Enter initial price"
                  value={initialPrice}
                  onChange={(value) => setInitialPrice(+value)}
                  required
                  allowNegative={false}
                />
              </Stack>
            </Grid.Col>
            <Grid.Col span={1} /> {/* Add an empty column for spacing */}
            <Grid.Col span={3}>
              <b>Due Date</b>
              <DatePicker
                value={dueTime}
                onChange={setDueTime} // Update date on change
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <Divider my="15" />
            </Grid.Col>
            <Grid.Col span={12}>
              <b>Upload image(s)</b>
              <ImageDropzone files={files} setFiles={setFiles} />
            </Grid.Col>
            <Grid.Col span={12}>
              <Flex justify="center">
                <Button type="submit" mt="md">
                  Create Auction
                </Button>
              </Flex>
            </Grid.Col>
          </Grid>
        </form>
      </Paper>
    </Flex>
  );
};

export default AuctionForm;
