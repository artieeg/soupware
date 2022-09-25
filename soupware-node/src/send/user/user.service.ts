import { Injectable } from '@nestjs/common';
import { WebRtcTransport } from 'mediasoup/node/lib/WebRtcTransport';
import { User } from './types';

@Injectable()
export class UserService {
  private senders: Map<string, User>;

  constructor() {
    this.senders = new Map();
  }

  create(id: string, transport: WebRtcTransport) {
    this.senders.set(id, {
      id,
      transport,
      producers: {},
    });
  }

  get(sender_id: string) {
    return this.senders.get(sender_id);
  }
}
