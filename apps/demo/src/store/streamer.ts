import { SoupwareClient } from "@soupware/client";
import { CreateStreamerResponse } from "@soupware/server";
import { atom, useAtom } from "jotai";

const mediaPermissionToken = atom<string | null>(null);
const params = atom<CreateStreamerResponse | null>(null);
const client = atom<SoupwareClient | null>(null);

export const useStreamerToken = () => useAtom(mediaPermissionToken);
export const useStreamerParams = () => useAtom(params);
export const useStreamerClient = () => useAtom(client);
