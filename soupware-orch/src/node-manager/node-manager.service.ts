import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MediaNodeLoad } from '@soupware/internals';
import Redis from 'ioredis';

@Injectable()
export class NodeManagerService implements OnModuleInit {
  private redis: Redis;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.redis = new Redis(this.configService.get('MEDIA_NODES_STORE_ADDR'));
  }

  async updateNodeLoad(data: MediaNodeLoad) {
    await this.redis.hmset(data.id, data);
  }

  async delNode(id: string, kind: string) {
    await this.redis.srem(kind, id);

    return 'ok';
  }

  async addNode(id: string, kind: string) {
    await this.redis.sadd(kind, id);
  }

  //Get a random node of kind (temporary solution)
  async getNode(kind: string) {
    return this.redis.srandmember(kind);
  }
}
