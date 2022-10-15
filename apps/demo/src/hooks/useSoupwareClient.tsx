import { SoupwareClient } from "@soupware/client";
import { useQuery } from "@tanstack/react-query";
import { useRoomId } from "./useRoomId";
import { useStreamerParams } from "./useStreamerParams";

export const useSoupwareClient = () => {
  const room = useRoomId();
  const streamer = useStreamerParams(room);
  console.log({ streamer });
  const token = streamer?.mediaPermissionToken;

  const r = useQuery(["soupware-client", token], () => {
    if (token) {
      return new SoupwareClient(token);
    } else {
      return undefined;
    }
  });

  return r.data;
};
