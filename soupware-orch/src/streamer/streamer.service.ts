import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { NodeManagerService } from 'src/node-manager';

@Injectable()
export class StreamerService implements OnApplicationBootstrap {
  constructor(
    @Inject('MEDIA_NODE') private client: ClientProxy,
    private nodeManagerService: NodeManagerService,
  ) {}

  async onApplicationBootstrap() {
    await this.client.connect();
  }

  async create(streamer: string, room: string) {
    const sendNodeId = await this.nodeManagerService.getNode('SEND');

    const response = await firstValueFrom(
      this.client.send(`soupware.transport.send.create.${sendNodeId}`, {
        user: streamer,
        room,
      }),
    );

    await this.nodeManagerService.addNodeForRoom(room, sendNodeId);

    return { ...response, sendNodeId };
  }

  async connect(
    sendNodeId: string,
    user: string,
    room: string,
    dtlsParameters: any,
    rtpCapabilities: any,
  ) {
    await firstValueFrom(
      this.client.send(`soupware.transport.send.connect.${sendNodeId}`, {
        user,
        dtls: dtlsParameters,
        room,
        rtpCapabilities,
      }),
    );
  }

  async produce(
    user: string,
    room: string,
    sendNodeId: string,
    producerOptions: any,
  ) {
    return await firstValueFrom(
      this.client.send(`soupware.producer.create.${sendNodeId}`, {
        user,
        producerOptions,
        room,
      }),
    );
  }
}
