import {
  Consumer,
  ConsumerParams,
  SoupwareClient,
  Transport,
  UserParams,
} from "@soupware/client";
import create from "zustand";

interface ConsumerStore {
  params: UserParams | null;
  client: SoupwareClient | null;
  consumers: Consumer[];
  isConsuming: boolean;
  transport: Transport | null;
  streams: MediaStream[];
  hasConnectedTransport: boolean;

  connect(): Promise<void>;
  consume(consumeParams: ConsumerParams[]): Promise<void>;
}

export const useConsumerStore = create<ConsumerStore>()((set, get) => ({
  params: null,
  client: null,
  streams: [],
  consumers: [],
  transport: null,
  hasConnectedTransport: false,
  isConsuming: false,

  async connect() {
    const { params, client } = get();

    if (!params || !client) return;

    const transport = await client.createRecvTransport(
      params.transportConnectParams.routerRtpParameters,
      params.transportConnectParams.transportOptions
    );

    set({
      transport,
      hasConnectedTransport: true,
    });
  },

  async consume(params) {
    const { client, transport, hasConnectedTransport: canConsume } = get();

    if (!client || !transport || !canConsume) return;

    const consumers = await Promise.all(
      params.map(async (p) => transport.consume(p))
    );

    set({
      consumers,
      isConsuming: true,
      streams: consumers.map((c) => new MediaStream([c.track])),
    });
  },
}));
