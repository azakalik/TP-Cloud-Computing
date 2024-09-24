import { FileWithPath } from "@mantine/dropzone";
import { API_GW_URL } from "./constants";
import AuctionCardType from "./types/AuctionCardType";
import AuctionDetailType from "./types/AuctionDetailType";
import NewAuctionType from "./types/NewAuctionType";

// const fakeAuctions: AuctionCardType[] = [
//   {
//     id: "1",
//     user: "hola@gmail.com",
//     imageUrl: "https://via.placeholder.com/300",
//     title: "Luxury Watch",
//     description: "A high-end luxury watch with diamonds and gold.",
//     countryFlag: "🇨🇭",
//     initialPrice: 500,
//     initialTime: "2024-09-21 10:00 AM",
//     endTime: "2024-09-25 10:00 AM",
//   },
//   {
//     id: "2",
//     user: "hola@gmail.com",
//     imageUrl: "https://via.placeholder.com/300",
//     title: "Vintage Car",
//     description: "Classic vintage car from the 1960s.",
//     countryFlag: "🇺🇸",
//     initialPrice: 10000,
//     initialTime: "2024-09-20 09:00 AM",
//     endTime: "2024-09-30 09:00 AM",
//   },
//   {
//     id: "4",
//     user: "hola@gmail.com",
//     imageUrl: "https://via.placeholder.com/300",
//     title: "Modern Art Piece",
//     description: "An abstract painting by a famous contemporary artist.",
//     countryFlag: "🇪🇸",
//     initialPrice: 3000,
//     initialTime: "2024-09-19 02:00 PM",
//     endTime: "2024-09-26 02:00 PM",
//   },
//   {
//     id: "5",
//     user: "hola@gmail.com",
//     imageUrl: "https://via.placeholder.com/300",
//     title: "Rare Coin Collection",
//     description: "A set of rare coins from around the world.",
//     countryFlag: "🇬🇧",
//     initialPrice: 1500,
//     initialTime: "2024-09-18 11:00 AM",
//     endTime: "2024-09-24 11:00 AM",
//   },
//   {
//     id: "6",
//     user: "hola@gmail.com",
//     imageUrl: "https://via.placeholder.com/300",
//     title: "Signed Sports Memorabilia",
//     description: "A jersey signed by a legendary football player.",
//     countryFlag: "🇧🇷",
//     initialPrice: 2500,
//     initialTime: "2024-09-15 09:00 AM",
//     endTime: "2024-09-22 09:00 AM",
//   },
//   // Add more items as needed
// ];

// const fakeUserAuctions: AuctionCardType[] = [
//   {
//     id: "7",
//     user: "hola@gmail.com",
//     imageUrl: "https://via.placeholder.com/300",
//     title: "Exotic Beach Resort Stay",
//     description: "A week-long stay at a luxury beach resort.",
//     countryFlag: "🇹🇭",
//     initialPrice: 1200,
//     initialTime: "2024-10-01 08:00 AM",
//     endTime: "2024-10-15 08:00 AM",
//   },
//   {
//     id: "8",
//     user: "hola@gmail.com",
//     imageUrl: "https://via.placeholder.com/300",
//     title: "Fine Wine Collection",
//     description: "A selection of rare wines from around the world.",
//     countryFlag: "🇫🇷",
//     initialPrice: 800,
//     initialTime: "2024-10-02 03:00 PM",
//     endTime: "2024-10-10 03:00 PM",
//   },
//   {
//     id: "9",
//     user: "hola@gmail.com",
//     imageUrl: "https://via.placeholder.com/300",
//     title: "Luxury Yacht Experience",
//     description: "A day on a luxury yacht with gourmet dining.",
//     countryFlag: "🇮🇹",
//     initialPrice: 5000,
//     initialTime: "2024-10-05 11:00 AM",
//     endTime: "2024-10-12 11:00 AM",
//   },
//   {
//     id: "10",
//     user: "hola@gmail.com",
//     imageUrl: "https://via.placeholder.com/300",
//     title: "High-End Camera Kit",
//     description: "A professional camera kit for photography enthusiasts.",
//     countryFlag: "🇯🇵",
//     initialPrice: 1500,
//     initialTime: "2024-10-03 01:00 PM",
//     endTime: "2024-10-08 01:00 PM",
//   },
//   {
//     id: "11",
//     user: "hola@gmail.com",
//     imageUrl: "https://via.placeholder.com/300",
//     title: "Concert VIP Tickets",
//     description: "Two VIP tickets to an exclusive concert.",
//     countryFlag: "🇦🇺",
//     initialPrice: 600,
//     initialTime: "2024-10-04 05:00 PM",
//     endTime: "2024-10-11 05:00 PM",
//   },
// ];

// const fakeAuctionDetail: AuctionDetailType = {
//   id: "1",
//   imageUrls: [
//     "https://images.unsplash.com/photo-1601924357840-3e50ad4dd9fd?q=80&w=2788&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     "https://via.placeholder.com/300",
//   ],
//   title: "Luxury Watch",
//   description: "A high-end luxury watch with diamonds and gold.",
//   countryFlag: "🇨🇭",
//   initialPrice: 500,
//   initialTime: "2024-09-21 10:00 AM",
//   endTime: "2024-09-25 10:00 AM",
// };

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
// export const fetchUserAuctions = async (): Promise<AuctionCardType[]> => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve(fakeUserAuctions);
//     }, 1000); // Simulating network delay
//   });
// };

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

export const uploadNewAuction = async (
  title: string,
  description: string,
  initialPrice: number,
  images: FileWithPath[],
  dueTime: Date
): Promise<void> => {
  const reader = new FileReader();
  reader.readAsDataURL(images[0]); // todo handle multiple files

  reader.onloadend = async () => {
    const base64Image = reader.result?.toString();

    const payload: NewAuctionType = {
      imageUrls: [base64Image!],
      title,
      description,
      countryFlag: "🇺🇸",
      initialPrice,
      initialTime: new Date().toISOString(),
      endTime: dueTime,
    };

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Response:", data);
      } else {
        console.error("Error: Failed to submit form");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
};
