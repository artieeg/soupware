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

  async create(streamer: string) {
    const sendNodeId = await this.nodeManagerService.getNode('SEND');

    const response = await firstValueFrom(
      this.client.send(`soupware.transport.create.${sendNodeId}`, {
        user: streamer,
      }),
    );

    return { ...response, sendNodeId };
  }

  async connect(sendNodeId: string, user: string, dtlsParameters: any) {
    await firstValueFrom(
      this.client.send(`soupware.transport.connect.${sendNodeId}`, {
        user,
        dtls: dtlsParameters,
      }),
    );
  }
}