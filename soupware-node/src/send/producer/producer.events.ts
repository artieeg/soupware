import { Producer } from 'mediasoup/node/lib/types';

export interface ProducerEvents {
  'new-producer': { producer: Producer; room: string; user: string };
}
