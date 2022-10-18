import { SoupwareClient } from "@soupware/client";
import { useEffect } from "react";
import { useConsumerStore } from "../store";
import { trpc } from "../utils/trpc";
import { useRoomId } from "./useRoomId";
import { useSignalers } from "./useSignalers";

function useViewerCreate() {
  const room = useRoomId();
  const createViewerMutation = trpc.viewer.create.useMutation();

  const signalers = useSignalers();

  const create = async () => {
    if (!room || useConsumerStore.getState().params) return;

    const r = await createViewerMutation.mutateAsync({
      room,
    });

    useConsumerStore.setState({
      params: r,
      client: new SoupwareClient(r.mediaPermissionToken, signalers),
    });
  };

  useEffect(() => {
    create();
  }, [room]);
}

export function useMediaConsumers() {
  useViewerCreate();

  const createConsumersMutation = trpc.viewer.consume.useMutation();
  const hasConnectedTransport = useConsumerStore(
    (state) => state.hasConnectedTransport
  );
  const isConsuming = useConsumerStore((state) => state.isConsuming);
  const streams = useConsumerStore((state) => state.streams);
  const params = useConsumerStore((state) => state.params);
  const client = useConsumerStore((state) => state.client);
  const connectTransport = useConsumerStore((state) => state.connect);

  const consume = async () => {
    if (!client || !params || isConsuming) return;

    const transport = await client.createRecvTransport(
      params.transportConnectParams.routerRtpParameters,
      params.transportConnectParams.transportOptions
    );

    const r = await createConsumersMutation.mutateAsync({
      rtpCapabilities: client.recvRtpCapabilities,
      mediaPermissionToken: params.mediaPermissionToken,
    });

    const _c = await Promise.all(
      r.map(async ({ consumerParameters }) => {
        return new MediaStream([
          (await transport.consume(consumerParameters)).track,
        ]);
      })
    );

    useConsumerStore.setState({ streams: _c, transport, isConsuming: true });
  };

  useEffect(() => {
    consume();
  }, [hasConnectedTransport, client, params, isConsuming]);

  return streams;
}
