import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

const PREFIX_ASSIGNED_RECORDER_ID = 'RECORDER_FOR_';

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

  async setRecorderFor(room: string, recorderId: string) {
    await this.redis.set(`${PREFIX_ASSIGNED_RECORDER_ID}${room}`, recorderId);

    return recorderId;
  }

  async getRecorderFor(room: string) {
    return this.redis.get(`${PREFIX_ASSIGNED_RECORDER_ID}${room}`);
  }
}
