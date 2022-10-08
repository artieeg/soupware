import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AudioLevel } from '@soupware/internals';
import Redis from 'ioredis';
import { WebhookAudioLevels, WebhookService } from 'src/webhook';

@Injectable()
export class AudioLevelsService implements OnModuleInit, OnModuleDestroy {
  private redis: Redis;
  private webhookDispatchInterval: NodeJS.Timer;

  constructor(
    private configService: ConfigService,
    private webhookService: WebhookService,
  ) {
    this.redis = new Redis(this.configService.get('AUDIO_LEVELS_STORE_ADDR'), {
      lazyConnect: true,
    });
  }

  async onModuleInit() {
    await this.redis.connect();

    this.webhookDispatchInterval = setInterval(
      this.dispatchAudioLevels.bind(this),
      this.configService.get('AUDIO_LEVELS_WEBHOOK_INTERVAL'),
    );
  }

  private async dispatchAudioLevels() {
    const rooms = await this.redis.keys('*');

    const pipe = this.redis.pipeline();

    rooms.forEach((room) => {
      pipe.hgetall(room);
    });

    const result = await pipe.exec();
    const userVolumeMaps: Record<string, number>[] = result.map(
      ([, audioLevels]) => audioLevels as any,
    );

    const roomAudioLevels: Record<
      string,
      Record<string, number>
    > = rooms.reduce((p, c, idx) => {
      return {
        ...p,
        [c]: userVolumeMaps[idx],
      };
    }, {});

    await this.webhookService.post<WebhookAudioLevels>({
      name: 'audio-levels',
      payload: {
        levels: roomAudioLevels,
      },
    });
  }

  async onModuleDestroy() {
    clearInterval(this.webhookDispatchInterval);
  }

  async updateAudioLevels(receivedAudioLevels: AudioLevel[]) {
    const pipe = this.redis.pipeline();

    receivedAudioLevels.forEach(({ user, room, volume }) => {
      pipe.hset(room, user, volume);
    });

    await pipe.exec();
  }
}
