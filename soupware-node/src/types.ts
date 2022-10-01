import { Producer as MediasoupProducer } from 'mediasoup/node/lib/types';
import { SEND_NODE, RECV_NODE } from './constants';

export type NodeKind = typeof SEND_NODE | typeof RECV_NODE;

export type AppData = {
  user: string;
  room: string;
};

export interface Producer extends MediasoupProducer {
  appData: AppData;
}
