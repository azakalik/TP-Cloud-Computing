// src/stores/useBidStore.ts
import { fetchAuctions, fetchAuctionDetail, fetchUserAuctions } from "../api.ts";
import AuctionCardType from "../../../shared_types/AuctionCardType.ts";
import AuctionDetailType from "../../../shared_types/AuctionDetailType.ts";
import { create } from "zustand";

interface BidStore {
  auctions: AuctionCardType[];
  userAuctions: AuctionCardType[];
  selectedBid: AuctionDetailType | null;
  fetchAuctions: () => Promise<void>;
   fetchUserAuctions: () => Promise<void>;
  fetchAuctionDetail: (id: string) => Promise<void>;
}

const useBidStore = create<BidStore>((set) => ({
  auctions: [],
  userAuctions: [],
  selectedBid: null,
  fetchAuctions: async () => {
    const fetchedBids = await fetchAuctions();
    set({ auctions: fetchedBids });
  },
  fetchUserAuctions: async () => {
      const fetchedUserBids = await fetchUserAuctions();
      set({ userAuctions: fetchedUserBids });
   },
  fetchAuctionDetail: async (id: string) => {
    const detail = await fetchAuctionDetail(id);
    set({ selectedBid: detail });
  },
}));

export default useBidStore;
