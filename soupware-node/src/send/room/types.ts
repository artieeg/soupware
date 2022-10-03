import { SoupwareProducer, UserBase } from '@app/types';
import { WebRtcTransport } from 'mediasoup/node/lib/types';

export type Room = {
  id: string;
  users: User[];

  /** Array of recv node ids this room is being piped to */
  pipes: string[];
};

export interface User extends UserBase {
  transport: WebRtcTransport;
  producers: {
    audio?: SoupwareProducer;
    video?: SoupwareProducer;
  };
}
