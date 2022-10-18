import { StoreApi } from "zustand";
import create from "zustand";

export interface RoleStore {
  role: "streamer" | "viewer";
  set: StoreApi<RoleStore>["setState"];
  get: StoreApi<RoleStore>["getState"];
}

export const useRoleStore = create<RoleStore>()((set, get) => ({
  role: "viewer",
  set,
  get,
}));
