import { Producer, Consumer, Transport } from 'mediasoup/node/lib/types';

export type Room = {
  id: string;
  producers: Producer[];
  users: User[];
};

export type User = {
  id: string;
  transport: Transport;
  consumers: Consumer[];
};
