import { Signalers } from "@soupware/client";
import { trpc } from "../utils/trpc";

export function useSignalers(): Signalers {
  const connectViewerMutation = trpc.viewer.connect.useMutation();
  const connectStreamerMutation = trpc.streamer.connect.useMutation();
  const produceStreamMutation = trpc.streamer.produce.useMutation();

  return {
    consumer: {
      connect: connectViewerMutation.mutateAsync,
    },
    streamer: {
      connect: connectStreamerMutation.mutateAsync,
      produce: produceStreamMutation.mutateAsync,
    },
  };
}
