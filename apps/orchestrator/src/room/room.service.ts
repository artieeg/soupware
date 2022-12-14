import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

const PREFIX_ROOM_PIPES = 'room_pipes_';
const PREFIX_NODES_FOR_ROOM = 'nodes_for_';

@Injectable()
export class RoomService implements OnApplicationShutdown {
  private redis: Redis;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.redis = new Redis(this.configService.get('ROOMS_STORE_ADDR'));
  }

  async onApplicationShutdown() {
    if (process.env.NODE_ENV !== 'production') {
      await this.redis.flushdb();
    }
  }

  async addNodeForRoom(room: string, node: string) {
    await this.redis.sadd(PREFIX_NODES_FOR_ROOM + room, node);
  }

  async getNodesOfKindFor(room: string, kind: 'SEND' | 'RECV') {
    const ids = await this.redis.smembers(PREFIX_NODES_FOR_ROOM + room);

    return ids.filter((node) => node.startsWith(kind));
  }

  async addRoomPipe(room: string, pipedRecvNodeId: string) {
    await this.redis.sadd(PREFIX_ROOM_PIPES + room, pipedRecvNodeId);
  }

  async isRoomPipedTo(room: string, recvNodeId: string) {
    return (
      (await this.redis.sismember(PREFIX_ROOM_PIPES + room, recvNodeId)) === 1
    );
  }
}
