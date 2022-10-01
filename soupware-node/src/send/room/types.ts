import { Producer } from '@app/types';
import { RtpCapabilities } from 'mediasoup/node/lib/RtpParameters';
import { WebRtcTransport } from 'mediasoup/node/lib/WebRtcTransport';

export type Room = {
  id: string;
  users: User[];

  /** Array of recv node ids this room is being piped to */
  pipes: string[];
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
