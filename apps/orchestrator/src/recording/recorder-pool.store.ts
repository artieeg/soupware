import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RecorderPoolStore implements OnModuleInit {
  private redis = new Redis();

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    this.redis = new Redis(this.configService.get('RECORDER_POOL_STORE_ADDR'));
  }

  async delRecorder(recorderId: string) {
    await this.redis.srem('recorders', recorderId);
  }

  async addNewRecorder(recorderId: string) {
    await this.redis.sadd('recorders', recorderId);
  }

  async getRecorder() {
    const recorderId = await this.redis.srandmember('recorders');

    if (!recorderId) {
      throw new Error('No recorders available');
    }

    return recorderId;
  }
}
