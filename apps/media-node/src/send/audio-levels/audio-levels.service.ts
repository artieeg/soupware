import { SoupwareProducer } from '@app/types';
import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  AudioLevelObserver,
  AudioLevelObserverVolume,
} from 'mediasoup/node/lib/AudioLevelObserver';
import { SendRouterService } from '../send-router';

interface SoupwareAudioLevel extends AudioLevelObserverVolume {
  producer: SoupwareProducer;
}

@Injectable()
export class AudioLevelsService implements OnModuleInit {
  private observer: AudioLevelObserver;

  constructor(private sendRouterService: SendRouterService) {}

  async onModuleInit() {
    const router = this.sendRouterService.getRouter();
    this.observer = await router.createAudioLevelObserver();

    this.observer.on('volumes', (volumes: SoupwareAudioLevel[]) => {});
  }

  track(producer: SoupwareProducer) {
    this.observer.addProducer({ producerId: producer.id });
  }

  stopTracking(producer: SoupwareProducer) {
    this.observer.removeProducer({ producerId: producer.id });
  }
}
