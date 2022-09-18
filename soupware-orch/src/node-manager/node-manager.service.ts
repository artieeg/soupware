import {
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class NodeManagerService implements OnModuleInit, OnApplicationShutdown {
  redis: Redis;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.redis = new Redis(this.configService.get('MEDIA_NODES_STORE_ADDR'));
  }

  async onApplicationShutdown() {
    if (process.env.NODE_ENV !== 'production') {
      await this.redis.flushdb();
    }
  }

  async addNode(id: string, kind: string) {
    await this.redis.sadd(kind, id);
  }

  //Get a random node of kind (temporary solution)
  async getNode(kind: string) {
    return this.redis.srandmember(kind);
  }
}
