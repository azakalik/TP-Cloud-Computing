import { FileWithPath } from "@mantine/dropzone";
import { API_GW_URL } from "./constants";
import AuctionCardType from "../../shared_types/AuctionCardType";
import AuctionDetailType from "../../shared_types/AuctionDetailType";
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


export const deleteSubscriptionToSnS = async (publicationId: string): Promise<boolean> => {
  try {
    const response = await api.delete(`/publications/suscribeSnS?publicationId=${publicationId}`);
    return response.status === 200;
  } catch (err) {
      if (axios.isAxiosError(err) &&  err.response?.status === 404){
        console.log("Attempted to unsuscribe a user that was not suscribed already")
        return true;//user is not suscribed
      }
    console.log(err)
  }

  throw new Error("Unexpected api response");
}


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

  export const uploadNewAuction = async (
    user: string,
    title: string,
    description: string,
    countryFlag: string,
    initialPrice: number,
    images: FileWithPath[],
    dueTime: Date
  ): Promise<boolean> => {
    try {
      // Upload auction details and get presigned URL for the image
      const response = await api.post('/publications', {
        user,
        title,
        description,
        countryFlag,
        initialPrice,
        contentType: images[0].type,
        initialTime: new Date().toISOString(),
        endTime: dueTime.toISOString(),
      });
  
      // Check if the response status is ok
      if (response.status !== 200) {
        throw new Error("Failed to get presigned URL");
      }
  
      const presignedUrl = response.data.presignedUrl;
  
      // Use the presigned URL to upload the image to S3
      const imageUploadResponse = await fetch(presignedUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': images[0].type,
        },
        body: images[0],
      });
  
      if (!imageUploadResponse.ok) {
        throw new Error("Failed to upload image to S3");
      }
  
      return true; // Auction created successfully
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

