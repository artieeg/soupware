import { SoupwarePlainTransport, SoupwareProducer, UserBase } from '@app/types';
import { Consumer, WebRtcTransport } from 'mediasoup/node/lib/types';

export type Room = {
  id: string;
  users: User[];

  plain_transport?: SoupwarePlainTransport;

  /** Array of recv node ids this room is being piped to */
  pipes: string[];
};

export interface User extends UserBase {
  transport: WebRtcTransport;
  plainConsumers: {
    audio?: Consumer;
    video?: Consumer;
  };
  producers: {
    audio?: SoupwareProducer;
    video?: SoupwareProducer;
  };
}
