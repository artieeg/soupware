import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { trpc } from "../utils/trpc";
import { useRoomId } from "./useRoomId";

export const useConsumerParams = () => {
  const room = useRoomId();
  const queryClient = useQueryClient();
  const { data } = useQuery<{
    transportConnectParams: {
      routerRtpParameters: any;
      transportOptions: any;
    };
    mediaPermissionToken: string;
  }>(["consumer-params"]);
  const createViewerMutation = trpc.viewer.create.useMutation();

  const create = async () => {
    console.log({ room });
    if (!room) {
      return;
    }

    const r = await createViewerMutation.mutateAsync({
      room,
    });

    console.log("create viewer response", r);

    queryClient.setQueryData(["consumer-params"], r);
    queryClient.setQueryData(
      ["media-permission-token", "recv"],
      r.mediaPermissionToken
    );
  };

  useEffect(() => {
    if (!data) {
      create();
    }
  }, [data, room]);

  return data;
};
