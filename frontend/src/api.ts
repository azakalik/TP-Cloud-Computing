import { FileWithPath } from "@mantine/dropzone";
import { API_GW_URL } from "./constants";
import AuctionCardType from "./types/AuctionCardType";
import AuctionDetailType from "./types/AuctionDetailType";
import NewAuctionType from "./types/NewAuctionType";

const fakeAuctions: AuctionCardType[] = [
  {
    id: "1",
    user: "hola@gmail.com",
    imageUrl: "https://via.placeholder.com/300",
    title: "Luxury Watch",
    description: "A high-end luxury watch with diamonds and gold.",
    countryFlag: "🇨🇭",
    initialPrice: 500,
    initialTime: "2024-09-21 10:00 AM",
    endTime: "2024-09-25 10:00 AM",
  },
  {
    id: "2",
    user: "hola@gmail.com",
    imageUrl: "https://via.placeholder.com/300",
    title: "Vintage Car",
    description: "Classic vintage car from the 1960s.",
    countryFlag: "🇺🇸",
    initialPrice: 10000,
    initialTime: "2024-09-20 09:00 AM",
    endTime: "2024-09-30 09:00 AM",
  },
  {
    id: "4",
    user: "hola@gmail.com",
    imageUrl: "https://via.placeholder.com/300",
    title: "Modern Art Piece",
    description: "An abstract painting by a famous contemporary artist.",
    countryFlag: "🇪🇸",
    initialPrice: 3000,
    initialTime: "2024-09-19 02:00 PM",
    endTime: "2024-09-26 02:00 PM",
  },
  {
    id: "5",
    user: "hola@gmail.com",
    imageUrl: "https://via.placeholder.com/300",
    title: "Rare Coin Collection",
    description: "A set of rare coins from around the world.",
    countryFlag: "🇬🇧",
    initialPrice: 1500,
    initialTime: "2024-09-18 11:00 AM",
    endTime: "2024-09-24 11:00 AM",
  },
  {
    id: "6",
    user: "hola@gmail.com",
    imageUrl: "https://via.placeholder.com/300",
    title: "Signed Sports Memorabilia",
    description: "A jersey signed by a legendary football player.",
    countryFlag: "🇧🇷",
    initialPrice: 2500,
    initialTime: "2024-09-15 09:00 AM",
    endTime: "2024-09-22 09:00 AM",
  },
  // Add more items as needed
];

const fakeUserAuctions: AuctionCardType[] = [
  {
    id: "7",
    user: "hola@gmail.com",
    imageUrl: "https://via.placeholder.com/300",
    title: "Exotic Beach Resort Stay",
    description: "A week-long stay at a luxury beach resort.",
    countryFlag: "🇹🇭",
    initialPrice: 1200,
    initialTime: "2024-10-01 08:00 AM",
    endTime: "2024-10-15 08:00 AM",
  },
  {
    id: "8",
    user: "hola@gmail.com",
    imageUrl: "https://via.placeholder.com/300",
    title: "Fine Wine Collection",
    description: "A selection of rare wines from around the world.",
    countryFlag: "🇫🇷",
    initialPrice: 800,
    initialTime: "2024-10-02 03:00 PM",
    endTime: "2024-10-10 03:00 PM",
  },
  {
    id: "9",
    user: "hola@gmail.com",
    imageUrl: "https://via.placeholder.com/300",
    title: "Luxury Yacht Experience",
    description: "A day on a luxury yacht with gourmet dining.",
    countryFlag: "🇮🇹",
    initialPrice: 5000,
    initialTime: "2024-10-05 11:00 AM",
    endTime: "2024-10-12 11:00 AM",
  },
  {
    id: "10",
    user: "hola@gmail.com",
    imageUrl: "https://via.placeholder.com/300",
    title: "High-End Camera Kit",
    description: "A professional camera kit for photography enthusiasts.",
    countryFlag: "🇯🇵",
    initialPrice: 1500,
    initialTime: "2024-10-03 01:00 PM",
    endTime: "2024-10-08 01:00 PM",
  },
  {
    id: "11",
    user: "hola@gmail.com",
    imageUrl: "https://via.placeholder.com/300",
    title: "Concert VIP Tickets",
    description: "Two VIP tickets to an exclusive concert.",
    countryFlag: "🇦🇺",
    initialPrice: 600,
    initialTime: "2024-10-04 05:00 PM",
    endTime: "2024-10-11 05:00 PM",
  },
];

const fakeAuctionDetail: AuctionDetailType = {
  id: "1",
  imageUrls: [
    "https://images.unsplash.com/photo-1601924357840-3e50ad4dd9fd?q=80&w=2788&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://via.placeholder.com/300",
  ],
  title: "Luxury Watch",
  description: "A high-end luxury watch with diamonds and gold.",
  countryFlag: "🇨🇭",
  initialPrice: 500,
  initialTime: "2024-09-21 10:00 AM",
  endTime: "2024-09-25 10:00 AM",
};

export const fetchAuctions = async (): Promise<AuctionCardType[]> => {
  try {
    const response = await fetch(`${API_GW_URL}/publications`);
    if (!response.ok) {
      throw new Error(`Error fetching auctions: ${response.statusText}`);
    }

    const data: AuctionCardType[] = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch auctions:", error);
    return []; // Return an empty array in case of error
  }
};

// todo implement in backend
export const fetchUserAuctions = async (): Promise<AuctionCardType[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(fakeUserAuctions);
    }, 1000); // Simulating network delay
  });
};

export const fetchAuctionDetail = async (
  id: string
): Promise<AuctionDetailType> => {
  try {
    const response = await fetch(`${API_GW_URL}/publications?publicationId=${id}`);
    if (!response.ok) {
      throw new Error(`Error fetching auctions: ${response.statusText}`);
    }

    const data: AuctionDetailType = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch auctions:", error);
    throw Error("Not found :("); // Return an empty array in case of error
  }
};

export const uploadBid = async (
  id: string,
  bidAmount: number
): Promise<void> => {
  console.log("uploadBid called with id:", id, "and bidAmount:", bidAmount);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 1000); // Simulating network delay
  });
};

// Return true if the auction was uploaded successfully, false otherwise
export const uploadNewAuction = async (
  user: string,
  title: string,
  description: string,
  countryFlag: string,
  initialPrice: number,
  images: FileWithPath[],
  dueTime: Date
): Promise<boolean> => {
  // Function to convert File to base64
  const getBase64 = (file: FileWithPath): Promise<string | undefined> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        resolve(reader.result?.toString());
      };
      reader.onerror = (error) => reject(error);
    });
  };

  try {
    // Convert the first image to base64 (extend to handle multiple images if needed)
    const base64Image = await getBase64(images[0]);
    
    if (!base64Image) {
      throw new Error("Failed to convert image to base64");
    }

    // Proceed with the rest of your upload logic
    const payload: NewAuctionType = {
      user,
      title,
      description,
      countryFlag,
      initialPrice,
      images: [base64Image], // Base64 encoded image
      initialTime: new Date().toISOString(), // Current date in ISO string format
      endTime: dueTime.toISOString() // Convert date to ISO string format
    };

    // Example API call (replace with your actual logic)
    const response = await fetch(`${API_GW_URL}/publications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Failed to upload auction: ${response.statusText}`);
    }

    return true; // Success
  } catch (error) {
    console.error("Error uploading auction:", error);
    return false; // Failure
  }
};