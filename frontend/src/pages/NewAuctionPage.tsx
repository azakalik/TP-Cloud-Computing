import React, { useState } from 'react';
import { Button, TextInput, NumberInput, Textarea, FileInput, Box, Flex } from '@mantine/core';
import { DatePicker } from '@mantine/dates';

const AuctionForm = () => {
  const [user, setUser] = useState('');
  const [initialPrice, setInitialPrice] = useState<number | undefined>(undefined);
  const [dueTime, setDueTime] = useState<Date | null>(null); // DatePicker state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!file) {
      alert('Please upload an image');
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      const base64Image = reader.result?.toString();

      const payload = {
        user,
        initialPrice,
        dueTime: dueTime?.toISOString(), // Ensure the date is in ISO format
        title,
        description,
        image: base64Image,
        filename: file.name,
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
    <Flex justify="center" align="center">
      <Box w={'80%'}> {/* Set a width for the form to keep it centered */}
        <form onSubmit={handleSubmit}>
          <TextInput
            label="User ID or Email"
            placeholder="Enter user ID or email"
            value={user}
            onChange={(event) => setUser(event.currentTarget.value)}
            required
          />

          <NumberInput
            label="Initial Price"
            placeholder="Enter initial price"
            value={initialPrice}
            onChange={(value) => setInitialPrice(+value)}
            required
          />

          <Flex justify="center" direction="column" align="center">
            <br />
            <div>Due date</div>
            <DatePicker
              value={dueTime}
              onChange={setDueTime} // Update date on change
            />
          </Flex>

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

          <FileInput
            label="Upload Image"
            placeholder="Choose an image"
            accept="image/*"
            onChange={(file) => setFile(file)}
            required
          />

          <Flex justify="center">
            <Button type="submit" mt="md">
              Create Auction
            </Button>
          </Flex>

        </form>
      </Box>
    </Flex>
  )
}


//   return (
//     <form onSubmit={handleSubmit}>
//       <TextInput
//         label="User ID or Email"
//         placeholder="Enter user ID or email"
//         value={user}
//         onChange={(event) => setUser(event.currentTarget.value)}
//         required
//       />

//       <NumberInput
//         label="Initial Price"
//         placeholder="Enter initial price"
//         value={initialPrice}
//         onChange={(value) => setInitialPrice(+value)}
//         required
//       />


//       <br />
//       <div>Due date</div>
//       <DatePicker
//         value={dueTime}
//         onChange={setDueTime} // Update date on change
//       />

//       <TextInput
//         label="Title"
//         placeholder="Enter title"
//         value={title}
//         onChange={(event) => setTitle(event.currentTarget.value)}
//         required
//       />

//       <Textarea
//         label="Description"
//         placeholder="Enter description"
//         value={description}
//         onChange={(event) => setDescription(event.currentTarget.value)}
//         required
//       />

//       <FileInput
//         label="Upload Image"
//         placeholder="Choose an image"
//         accept="image/*"
//         onChange={(file) => setFile(file)}
//         required
//       />

//       <Button type="submit" mt="md">
//         Submit
//       </Button>
//     </form>
//   );
// };

export default AuctionForm;
