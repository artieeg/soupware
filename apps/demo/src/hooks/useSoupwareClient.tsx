import { SoupwareClient } from "@soupware/client";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "../utils/trpc";
import { useRoomId } from "./useRoomId";
import { useStreamerParams } from "./useStreamerParams";

export const useSoupwareClient = () => {
  const room = useRoomId();
  const streamer = useStreamerParams(room);
  const token = streamer?.mediaPermissionToken;

  const connectStreamerMutation = trpc.streamer.connect.useMutation();
  const produceStreamMutation = trpc.streamer.produce.useMutation();

  const r = useQuery(["soupware-client", token], () => {
    if (token) {
      return new SoupwareClient(token, {
        streamer: {
          connect: (params) => {
            return connectStreamerMutation.mutateAsync(params);
          },
          produce: (params) => {
            return produceStreamMutation.mutateAsync(params);
          },
        },
      });
    } else {
      return undefined;
    }
  });

  return r.data;
};
