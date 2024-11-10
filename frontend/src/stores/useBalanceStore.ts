import { create } from "zustand";
import { fetchUserBalance } from "../api";


export type UserBalance = {
    total: number;
    available: number;
};

export type UserBalanceStoreType = {
    loading: boolean;
    balance: UserBalance;
    fetchBalance: () => Promise<void>;
    setBalance: (balance: UserBalance) => void;
};

const useUserBalanceStore = create<UserBalanceStoreType>((set) => ({
    loading: false,
    balance: { total: 0, available: 0 },
    fetchBalance: async () => {
        set({ loading: true });
        const balance = await fetchUserBalance();
        set({ balance, loading: false });
    },
    setBalance: (balance) => set({ balance }),
}));

export default useUserBalanceStore;