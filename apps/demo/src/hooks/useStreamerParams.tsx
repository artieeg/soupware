import { StreamerParams } from "@soupware/server";
import { useQuery } from "@tanstack/react-query";

export const useStreamerParams = (room: string) => {
  const r = useQuery<StreamerParams>(["streamer", room]);

  return r.data;
};
