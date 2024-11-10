import { FileWithPath } from "@mantine/dropzone";
import { API_GW_URL } from "./constants";
import AuctionCardType from "../../shared_types/AuctionCardType";
import AuctionDetailType from "../../shared_types/AuctionDetailType";
import NewAuctionType from "../../shared_types/NewAuctionType";
import AuctionInitialHighestBid from "../../shared_types/AuctionCurrentHighestBid";
import NewBidType from "../../shared_types/NewBidType";
import axios from "axios";
import {Auth} from "aws-amplify";
import { UserBalance } from "./stores/useBalanceStore";

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

export type ErrorResponse = {
  error: string;
}; 

type Response<T> = T | ErrorResponse;

const isErrorResponse = <T>(response: Response<T>): response is ErrorResponse => {
  return typeof response === 'object' && response && 'error' in response;
}

const sendOrFail = async <T>(request: () => Promise<T>, defaultErrorMessage: string): Promise<T | ErrorResponse> => {
  try {
    return await request();
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: defaultErrorMessage };
  }
};    

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


export const postSubscriptionToSnS = async (publicationId: string) : Promise<boolean> => {

  try {
    const response = await api.post(`/publications/suscribeSnS?publicationId=${publicationId}`);
    // Check if response status is 200 (OK)
    if (response.status === 200) {
      return true
    } else {
      throw new Error(`Error fetching auctions: ${response.statusText}`);
    }
  } catch (error) {
    return false; // Return an empty array in case of error
  }


}


export const fetchIsSubscribedToSnS = async (publicationId: string) : Promise<boolean> => {

  try {
    const response = await api.get(`/publications/suscribeSnS?publicationId=${publicationId}`);
    // Check if response status is 200 (OK)
    if (response.status === 200) {
      console.log(response.data);
      return response.data.isSubscribed; // Return data if successful
    } else {
      throw new Error(`Error fetching auctions: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Failed to fetch auctions:", error);
    return false; // Return an empty array in case of error
  }

}


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
  publicationId: string,
  price: number
): Promise<Response<UserBalance>> => 
  sendOrFail(async () => {
    const payload: NewBidType = {
      publicationId,
      price,
    };

    const response = await api.post<Response<UserBalance>>('/offers', payload, {
      validateStatus: () => true,
    });
    const data = response.data;

    if (response.status === 200 || response.status === 201) {
      return data;
    } else {
      const message = isErrorResponse(data) ? data.error : response.statusText;
      throw new Error(message);
    }
  }, "An error occurred while uploading the bid");


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

export const fetchUserBalance = async (): Promise<UserBalance> => {
  try {
    const response = await api.get('/funds');

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`Failed to fetch balance: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Failed to fetch balance:", error);
    return { total: 0, available: 0 };
  }
}

export const addFunds = async (amount: number): Promise<Response<UserBalance>> =>
  sendOrFail(async () => {
    const response = await api.put<Response<UserBalance>>('/funds', { amount });
    const data = response.data;
    if (response.status === 200 || response.status === 201) {
      return data;
    } else {
      const message = isErrorResponse(data) ? data.error : response.statusText;
      throw new Error(`Failed to add funds: ${message}`);
    }
  }, "Failed to add funds");

