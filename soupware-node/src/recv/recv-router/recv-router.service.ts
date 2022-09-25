import { mediaSoupConfig } from '@app/mediasoup.config';
import { Injectable } from '@nestjs/common';
import { createWorker } from 'mediasoup';
import { Router, Worker } from 'mediasoup/node/lib/types';
import { cpus } from 'os';

type RecvWorker = { worker: Worker; router: Router };

@Injectable()
export class RecvRouterService {
  private nextWorkerIdx: number = 0;
  private workers: RecvWorker[];
  private bridgeRecvWorker: RecvWorker;

  constructor() {
    this.workers = [];
  }

  async onModuleInit() {
    //Spawn workers (# of workers = # of CPUs - 1)
    const workersCount = cpus().length - 1;

    for (let i = 0; i < workersCount; i++) {
      const worker = await createWorker({});
      const router = await worker.createRouter({
        mediaCodecs: mediaSoupConfig.mediasoup.mediaCodecs,
      });

      this.workers.push({
        worker,
        router,
      });
    }

    const _bridgeRecvWorker = await createWorker({});
    const _bridgeRecvRouter = await _bridgeRecvWorker.createRouter({
      mediaCodecs: mediaSoupConfig.mediasoup.mediaCodecs,
    });

    this.bridgeRecvWorker = {
      worker: _bridgeRecvWorker,
      router: _bridgeRecvRouter,
    };
  }

  getBridgeRouter() {
    return this.bridgeRecvWorker.router;
  }

  getNextRouter() {
    const router =
      this.workers[this.nextWorkerIdx % this.workers.length].router;

    this.nextWorkerIdx++;

    return router;
  }
}
