import { Producer } from 'mediasoup/node/lib/Producer';
import { WebRtcTransport } from 'mediasoup/node/lib/WebRtcTransport';

export type User = {
  id: string;
  transport: WebRtcTransport;
  producers: {
    audio?: Producer;
    video?: Producer;
  };
};
