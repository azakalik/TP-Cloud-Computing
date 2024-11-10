import { create } from "zustand";
import { fetchUserBalance } from "../api";


export type UserBalance = {
    total: number;
    available: number;
};

export type UserBalanceStoreType = {
    balance: UserBalance;
    fetchBalance: () => Promise<void>;
    setBalance: (balance: UserBalance) => void;
};

const useUserBalanceStore = create<UserBalanceStoreType>((set) => ({
    balance: { total: 0, available: 0 },
    fetchBalance: async () => {
        const balance = await fetchUserBalance();
        set({ balance });
    },
    setBalance: (balance) => set({ balance }),
}));

export default useUserBalanceStore;