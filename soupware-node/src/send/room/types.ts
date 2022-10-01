import { RtpCapabilities, WebRtcTransport } from 'mediasoup/node/lib/types';
import { SoupwareSendProducer } from '../types';

export type Room = {
  id: string;
  users: User[];

  /** Array of recv node ids this room is being piped to */
  pipes: string[];
};

/** Serializable user */
export interface UserBase {
  id: string;
  rtpCapabilities?: RtpCapabilities;
}

export interface User extends UserBase {
  transport: WebRtcTransport;
  producers: {
    audio?: SoupwareSendProducer;
    video?: SoupwareSendProducer;
  };
}
