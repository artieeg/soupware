import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { NodeManagerService } from 'src/node-manager';

@Injectable()
export class ViewerService {
  constructor(
    @Inject('MEDIA_NODE') private client: ClientProxy,
    private nodeManagerService: NodeManagerService,
  ) {}

  async create(viewer: string, room: string) {
    const recvNodeId = await this.nodeManagerService.getNode('RECV');

    const response = await firstValueFrom(
      this.client.send(`soupware.transport.recv.create.${recvNodeId}`, {
        user: viewer,
        room,
      }),
    );

    return { ...response, recvNodeId };
  }
}
