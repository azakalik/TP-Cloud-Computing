import { FileWithPath } from "@mantine/dropzone";
import { API_GW_URL } from "./constants";
import AuctionCardType from "../../shared_types/AuctionCardType";
import AuctionDetailType from "../../shared_types/AuctionDetailType";
import NewAuctionType from "../../shared_types/NewAuctionType";
import AuctionInitialHighestBid from "../../shared_types/AuctionCurrentHighestBid";
import NewBidType from "../../shared_types/NewBidType";
import axios from "axios";
import {Auth} from "aws-amplify";

const api = axios.create({
  baseURL: `${API_GW_URL}`
});

api.interceptors.request.use(
  async (config) => {
    try {
      // Retrieve the current session and JWT token
      const session = await Auth.currentSession();
      const token = session.getIdToken().getJwtToken();

      // Attach the JWT token in the Authorization header with Bearer prefix
      config.headers['Authorization'] = `Bearer ${token}`;
    } catch (error) {
      console.error("Failed to attach JWT token:", error);
      throw error; // Optionally re-throw the error to handle it upstream
    }
    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

// Function to fetch auctions
export const fetchAuctions = async (): Promise<AuctionCardType[]> => {
  try {
    const response = await api.get('/publications');

    // Check if response status is 200 (OK)
    if (response.status === 200) {
      return response.data; // Return data if successful
    } else {
      throw new Error(`Error fetching auctions: ${response.statusText}`);
    }
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
    const response = await api.get(`/offers`, {
      params: { publicationId: id },
    });

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`Error fetching initial highest bid: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Failed to fetch current highest bid:", error);
    throw new Error("Not found :("); // Throw an error with a message
  }
};

export const fetchAuctionDetail = async (
  id: string
): Promise<AuctionDetailType> => {
  try {
    const response = await api.get(`/publications`, {
      params: { publicationId: id },
    });

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`Error fetching auction detail: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Failed to fetch auction details:", error);
    throw new Error("Not found :(");
  }
};

// Return true if the bid was uploaded successfully, false otherwise
export const uploadBid = async (
  userId: string,
  publicationId: string,
  price: number
): Promise<boolean> => {
  try {
    const payload: NewBidType = {
      userId,
      publicationId,
      price,
    };

    const response = await api.post('/offers', payload);

    if (response.status === 200 || response.status === 201) {
      return true; // Success
    } else {
      throw new Error(`Failed to upload bid: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Failed to upload bid:", error);
    return false; // Return false if there's an error
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
    const base64Image = await getBase64(images[0]); // Convert the first image to base64

    if (!base64Image) {
      throw new Error("Failed to convert image to base64");
    }

    const payload: NewAuctionType = {
      user,
      title,
      description,
      countryFlag,
      initialPrice,
      images: [base64Image], // Use the base64 encoded image
      initialTime: new Date().toISOString(), // Current date in ISO format
      endTime: dueTime.toISOString(), // Due time in ISO format
    };

    const response = await api.post('/publications', payload);

    if (response.status === 200 || response.status === 201) {
      return true; // Success
    } else {
      throw new Error(`Failed to upload auction: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error uploading auction:", error);
    return false; // Failure
  }
};

