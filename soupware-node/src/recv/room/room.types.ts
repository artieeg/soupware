import { Producer, Consumer, Transport } from 'mediasoup/node/lib/types';

export type Room = {
  id: string;
  producers: PipedProducer[];
  users: User[];
};

/**
 * Producer.
 * key -- egress router id
 * value -- producer on that router
 * */
export type PipedProducer = Map<string, Producer>;

export type User = {
  id: string;
  transport: Transport;
  consumers: Consumer[];
};
