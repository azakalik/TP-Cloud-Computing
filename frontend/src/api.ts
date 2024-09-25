import { FileWithPath } from "@mantine/dropzone";
import { API_GW_URL } from "./constants";
import AuctionCardType from "../../shared_types/AuctionCardType";
import AuctionDetailType from "../../shared_types/AuctionDetailType";
import NewAuctionType from "../../shared_types/NewAuctionType";
import AuctionInitialHighestBid from "../../shared_types/AuctionCurrentHighestBid";
import NewBidType from "../../shared_types/NewBidType";

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
  return new Promise(() => {
    // todo
  });
};

export const fetchAuctionInitialHighestBid = async (
  id: string
): Promise<AuctionInitialHighestBid> => {
  try {
    const response = await fetch(`${API_GW_URL}/offers?publicationId=${id}`);
    if (!response.ok) {
      throw new Error(`Error fetching auctions: ${response.statusText}`);
    }

    const data: AuctionInitialHighestBid = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch current highest bid:", error);
    throw Error("Not found :("); // Return an empty array in case of error
  }
};

export const fetchAuctionDetail = async (
  id: string
): Promise<AuctionDetailType> => {
  try {
    const response = await fetch(
      `${API_GW_URL}/publications?publicationId=${id}`
    );
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

// Return true if the bid was uploaded successfully, false otherwise
export const uploadBid = async (
  userId: string,
  publicationId: string,
  price: number
): Promise<boolean> => {
  console.log(
    "Uploading bid to publication ID:",
    publicationId,
    "with price:",
    price
  );
  try {
    const payload: NewBidType = {
      userId,
      publicationId,
      price,
    };
    const response = await fetch(`${API_GW_URL}/offers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Failed to upload auction: ${response.statusText}`);
    }
    return true;
  } catch {
    console.error("Failed to upload bid");
    return false;
  }
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
      endTime: dueTime.toISOString(), // Convert date to ISO string format
    };

    const response = await fetch(`${API_GW_URL}/publications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
