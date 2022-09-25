import { Injectable } from '@nestjs/common';
import { PipeTransport } from 'mediasoup/node/lib/PipeTransport';

@Injectable()
export class PipeService {
  private pipes: Map<string, PipeTransport>;

  constructor() {
    this.pipes = new Map();
  }
}
