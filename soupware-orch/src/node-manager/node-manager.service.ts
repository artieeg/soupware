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

  async getAvailableNodes(kind: string, exclude_ids: string[]) {
    const ids = await this.redis.smembers(kind);
    const filtered = ids.filter((id) => !exclude_ids.includes(id));

    return this.getInfoForNodes(filtered);
  }

  async addNode(id: string, kind: string) {
    await this.redis.sadd(kind, id);
  }

  async getNode(kind: string) {
    return this.redis.srandmember(kind);
  }

  async getInfoForNodes(ids: string[]): Promise<MediaNodeLoad[]> {
    const pipe = this.redis.pipeline();
    ids.forEach((id) => pipe.hgetall(id));
    const results = await pipe.exec();

    return results.map((result) => result[1] as MediaNodeLoad);
  }
}
