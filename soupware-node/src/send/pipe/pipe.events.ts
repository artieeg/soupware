import { PipeTransport } from 'mediasoup/node/lib/types';

export interface PipeEvents {
  'new-pipe': {
    targetRecvNodeId: string;
    transport: PipeTransport;
  };
}
