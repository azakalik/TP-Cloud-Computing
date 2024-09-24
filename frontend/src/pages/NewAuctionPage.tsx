import React, { useState } from 'react';
import { Button, TextInput, NumberInput, Textarea, Flex, Grid, Stack, Paper, Divider, Title } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { FileWithPath } from '@mantine/dropzone';
import ImageDropzone from '../components/ImageDropzone';

const AuctionForm = () => {
  const [user, setUser] = useState('');
  const [initialPrice, setInitialPrice] = useState<number | undefined>(undefined);
  const [dueTime, setDueTime] = useState<Date | null>(null); // DatePicker state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState<FileWithPath[]>([]); // Accept files as a state

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (files.length === 0) {
      alert('Please upload at least an image');
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(files[0]); // todo handle multiple files

    reader.onloadend = async () => {
      const base64Image = reader.result?.toString();

      const payload = {
        user,
        initialPrice,
        dueTime: dueTime?.toISOString(), // Ensure the date is in ISO format
        title,
        description,
        image: base64Image,
        filename: files[0].name,
      };

      try {
        const response = await fetch('/api/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Response:', data);
        } else {
          console.error('Error: Failed to submit form');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
  };



  return (
    <Flex justify="center" align="center" direction='column'>
    <Title mb='10'>Create new Auction</Title>
    <Paper w={'50%'} shadow='md' p='lg' mb='lg' withBorder>
      <form onSubmit={handleSubmit}>
        <Grid gutter="md"> {/* Use Grid for two-column layout */}
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
              onChange={(event) => setDescription(event.currentTarget.value)}
              required
            />
            <NumberInput
              label="Initial Price"
              placeholder="Enter initial price"
              value={initialPrice}
              onChange={(value) => setInitialPrice(+value)}
              required
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
            <Divider my='15' />
          </Grid.Col>

          <Grid.Col span={12}>
            <b>Upload image(s)</b>
            <ImageDropzone
              files={files}
              setFiles={setFiles}
            />
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
  )
}

export default AuctionForm;
