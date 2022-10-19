import { SoupwareClient } from "@soupware/client";
import { useEffect } from "react";
import { useConsumerStore, useUserStore } from "../store";
import { trpc } from "../utils/trpc";
import { useRoomId } from "./useRoomId";
import { useSignalers } from "./useSignalers";

function useViewerCreate() {
  const room = useRoomId();
  const createViewerMutation = trpc.viewer.create.useMutation();

  const signalers = useSignalers();

  const create = async () => {
    if (!room || useConsumerStore.getState().params) return;

    const { user, consumer } = await createViewerMutation.mutateAsync({
      room,
    });

    useUserStore.setState({
      user,
    });

    useConsumerStore.setState({
      params: consumer,
      client: new SoupwareClient(consumer.mediaPermissionToken, signalers),
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

  const consume = async () => {
    if (!client || !params || isConsuming) return;

    if (!hasConnectedTransport) {
      return useConsumerStore.getState().connect();
    }

    const r = await createConsumersMutation.mutateAsync({
      rtpCapabilities: client.recvRtpCapabilities,
      mediaPermissionToken: params.mediaPermissionToken,
    });

    await useConsumerStore
      .getState()
      .consume(r.map((r) => r.consumerParameters));
  };

  useEffect(() => {
    consume();
  }, [hasConnectedTransport, client, params, isConsuming]);

  return streams;
}
