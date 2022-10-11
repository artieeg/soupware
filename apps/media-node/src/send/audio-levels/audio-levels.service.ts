import { SoupwareProducer } from '@app/types';
import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import {
  AudioLevelObserver,
  AudioLevelObserverVolume,
} from 'mediasoup/node/lib/types';
import { SendRouterService } from '../send-router';

interface SoupwareAudioLevel extends AudioLevelObserverVolume {
  producer: SoupwareProducer;
}

@Injectable()
export class AudioLevelsService implements OnModuleInit, OnModuleDestroy {
  private observer: AudioLevelObserver;
  private interval: number;
  private enabled: boolean;

  constructor(
    private sendRouterService: SendRouterService,
    private configService: ConfigService,
    @Inject('ORCHESTRATOR') private client: ClientProxy,
  ) {
    this.interval = this.configService.get('AUDIO_LEVEL_INTERVAL');
    this.enabled = this.interval !== -1;
  }

  async onModuleInit() {
    if (!this.enabled) {
      return;
    }

    const router = this.sendRouterService.getRouter();
    this.observer = await router.createAudioLevelObserver({
      interval: 100,
    });

    this.observer.on('volumes', this.onReceiveVolumes.bind(this));
  }

  onModuleDestroy() {
    this.observer.removeAllListeners();
  }

  private onReceiveVolumes(volumes: SoupwareAudioLevel[]) {
    const data = volumes.map(({ producer, volume }) => {
      return {
        user: producer.appData.user.id,
        room: producer.appData.room,
        volume,
      };
    });

    this.client.emit('soupware.audio-levels', data);
  }

  track(producer: SoupwareProducer) {
    if (!this.enabled || producer.kind !== 'audio') {
      return;
    }

    this.observer.addProducer({ producerId: producer.id });
  }

  stopTracking(producer: SoupwareProducer) {
    if (!this.enabled) {
      return;
    }

    this.observer.removeProducer({ producerId: producer.id });
  }
}
