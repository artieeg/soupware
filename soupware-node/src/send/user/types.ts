import { WebRtcTransport } from 'mediasoup/node/lib/WebRtcTransport';

export type Producer = {
  id: string;
  transport: WebRtcTransport;
};
