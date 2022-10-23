import { UserParams } from "@soupware/server";
import { useQuery } from "@tanstack/react-query";

export const useStreamerParams = (room: string) => {
  const r = useQuery<UserParams>(["streamer", room]);

  return r.data;
};
