import { Injectable, OnModuleInit } from '@nestjs/common';
import { createWorker } from 'mediasoup';
import { Worker } from 'mediasoup/node/lib/Worker';
import { Router } from 'mediasoup/node/lib/Router';
import { mediaSoupConfig } from '@app/mediasoup.config';

@Injectable()
export class SendRouterService implements OnModuleInit {
  private worker: Worker;
  private router: Router;

  constructor() {}

  async onModuleInit() {
    this.worker = await createWorker({});
    this.router = await this.worker.createRouter({
      mediaCodecs: mediaSoupConfig.mediasoup.mediaCodecs,
    });
  }

  getRouter() {
    return this.router;
  }
}
