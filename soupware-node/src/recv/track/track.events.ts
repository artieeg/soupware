import { Consumer } from 'mediasoup/node/lib/Consumer';

export interface ConsumerEvents {
  'new-consumer': {
    consumer: Consumer;
    room: string;
    user: string;
  };
}
