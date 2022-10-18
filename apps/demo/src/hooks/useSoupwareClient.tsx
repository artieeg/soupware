import { SoupwareClient } from "@soupware/client";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "../utils/trpc";
import { useMediaPermissionToken } from "./useMediaPermissionToken";
import { useRoomId } from "./useRoomId";

export const useSoupwareClient = (direction: "send" | "recv") => {
  const token = useMediaPermissionToken(direction);

  const connectViewerMutation = trpc.viewer.connect.useMutation();
  const connectStreamerMutation = trpc.streamer.connect.useMutation();
  const produceStreamMutation = trpc.streamer.produce.useMutation();

  const r = useQuery(["soupware-client", direction, token ?? ""], () => {
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
        consumer: {
          connect: (params) => {
            console.log("viewer signaler", params);
            return connectViewerMutation.mutateAsync(params);
          },
        },
      });
    } else {
      return null;
    }
  });

  return r.data;
};
