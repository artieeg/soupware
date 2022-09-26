import { Producer } from 'mediasoup/node/lib/Producer';
import { RtpCapabilities } from 'mediasoup/node/lib/RtpParameters';
import { WebRtcTransport } from 'mediasoup/node/lib/WebRtcTransport';

export type Room = {
  id: string;
  users: User[];
};

export type User = {
  id: string;
  transport: WebRtcTransport;
  rtpCapabilities?: RtpCapabilities;
  producers: {
    audio?: Producer;
    video?: Producer;
  };
};
