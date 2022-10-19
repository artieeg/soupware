import create from "zustand";
import { User } from "../types";

interface UserStore {
  user: User | null;
}

export const useUserStore = create<UserStore>()(() => ({
  user: null,
}));
