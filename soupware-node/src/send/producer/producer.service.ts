import { Injectable } from '@nestjs/common';
import { WebRtcTransport } from 'mediasoup/node/lib/WebRtcTransport';
import { Producer } from './types';

@Injectable()
export class ProducerService {
  private senders: Map<string, Producer>;

  constructor() {
    this.senders = new Map();
  }

  create(id: string, transport: WebRtcTransport) {
    this.senders.set(id, {
      id,
      transport,
    });
  }

  get(sender_id: string) {
    return this.senders.get(sender_id);
  }
}
