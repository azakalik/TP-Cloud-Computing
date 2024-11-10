import { Auth } from "aws-amplify";
import { create } from "zustand";


export type UserData = {
    id: string;
    email: string;    
}

export type UserStoreType = {
    user: UserData | null;
    fetchUserData: () => Promise<void>;
};

const useUserStore = create<UserStoreType>((set) => ({
    user: null,
    fetchUserData: async () => {
        const session = await Auth.currentSession();
        const token = session.getIdToken().payload;
        set({ user: { id: token.sub, email: token.email } });
    },
}));

export default useUserStore;
    