import {
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MediaNodeLoad } from '@soupware/internals';
import Redis from 'ioredis';

const PREFIX_ROOM_PIPES = 'room_pipes_';
const PREFIX_NODES_FOR_ROOM = 'nodes_for_';

@Injectable()
export class NodeManagerService implements OnModuleInit, OnApplicationShutdown {
  private redis: Redis;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.redis = new Redis(this.configService.get('MEDIA_NODES_STORE_ADDR'));
  }

  async onApplicationShutdown() {
    if (process.env.NODE_ENV !== 'production') {
      await this.redis.flushdb();
    }
  }

  async updateNodeLoad(node: string, data: MediaNodeLoad) {
    await this.redis.hmset(node, data);
  }

  async addNodeForRoom(room: string, node: string) {
    await this.redis.sadd(PREFIX_NODES_FOR_ROOM + room, node);
  }

  async getSendNodesFor(room: string) {
    const nodes = await this.redis.smembers(PREFIX_NODES_FOR_ROOM + room);

    return nodes.filter((node) => node.startsWith('SEND'));
  }

  async addRoomPipe(room: string, pipedRecvNodeId: string) {
    await this.redis.sadd(PREFIX_ROOM_PIPES + room, pipedRecvNodeId);
  }

  async getPipedNodeIds(room: string) {
    return this.redis.smembers(PREFIX_ROOM_PIPES + room);
  }

  async isRoomPipedTo(room: string, recvNodeId: string) {
    return (
      (await this.redis.sismember(PREFIX_ROOM_PIPES + room, recvNodeId)) === 1
    );
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
