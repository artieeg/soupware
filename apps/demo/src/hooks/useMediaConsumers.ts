import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { trpc } from "../utils/trpc";
import { useConsumerParams } from "./useConsumerParams";
import { useRoomId } from "./useRoomId";
import { useSoupwareClient } from "./useSoupwareClient";

export const useMediaConsumers = () => {
  const room = useRoomId();
  const consumerParams = useConsumerParams();
  const client = useSoupwareClient("recv");
  const createConsumersMutation = trpc.viewer.consume.useMutation();

  const tracks = useQuery<MediaStream[]>(["streams", room]);
  const queryClient = useQueryClient();

  const isConsuming = useRef(false);

  const consume = async () => {
    console.log({ client, consumerParams });
    if (!client || !consumerParams || isConsuming.current) return;

    const transport = await client.createRecvTransport(
      consumerParams.transportConnectParams.routerRtpParameters,
      consumerParams.transportConnectParams.transportOptions
    );

    console.log({ transport });

    const r = await createConsumersMutation.mutateAsync({
      rtpCapabilities: client.recvRtpCapabilities,
      mediaPermissionToken: consumerParams.mediaPermissionToken,
    });

    console.log(r);

    const _c = await Promise.all(
      r.map(async ({ consumerParameters }) => {
        return new MediaStream([
          (await transport.consume(consumerParameters)).track,
        ]);
      })
    );
    console.log(_c);

    queryClient.setQueryData(["streams", room], _c);
    isConsuming.current = true;
  };

  useEffect(() => {
    consume();
  }, [client, consumerParams]);

  return tracks.data;
};
