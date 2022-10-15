import { CreateStreamerResponse } from "@soupware/server";
import { useQuery } from "@tanstack/react-query";

export const useStreamerParams = (room: string) => {
  const r = useQuery<CreateStreamerResponse>(["streamer", room]);

  return r.data;
};
