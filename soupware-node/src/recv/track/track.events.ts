import { Consumer } from 'mediasoup/node/lib/Consumer';

export interface TrackEvents {
  'new-track-consumer': {
    consumer: Consumer;
    room: string;
    user: string;
  };
}
