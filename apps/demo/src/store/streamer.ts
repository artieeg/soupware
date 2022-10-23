import { SoupwareClient, UserParams, Producer } from "@soupware/client";
import create from "zustand";

interface StreamerStore {
  params: UserParams | null;
  client: SoupwareClient | null;
  isStreaming: boolean;
  producers: Producer[];
  stream(track: MediaStreamTrack): Promise<void>;
}

export const useStreamerStore = create<StreamerStore>()((set, get) => ({
  params: null,
  client: null,
  isStreaming: false,
  producers: [],
  async stream(track) {
    const { isStreaming, params, client } = get();

    if (isStreaming || !params || !client) return;

    const transport = await client.createSendTransport(
      params.transportConnectParams.routerRtpParameters,
      params.transportConnectParams.transportOptions
    );

    const producer = await client.produce({
      track,
      transport,
    });

    set({
      producers: [...get().producers, producer],
      isStreaming: true,
    });
  },
}));
