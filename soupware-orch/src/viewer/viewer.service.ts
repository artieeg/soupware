import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { NodeManagerService } from 'src/node-manager';
import { PiperService } from 'src/piper';

@Injectable()
export class ViewerService {
  constructor(
    @Inject('MEDIA_NODE') private client: ClientProxy,
    private nodeManagerService: NodeManagerService,
    private piperService: PiperService,
  ) {}

  async create(viewer: string, room: string) {
    const recvNodeId = await this.nodeManagerService.getNode('RECV');

    const response = await firstValueFrom(
      this.client.send(`soupware.transport.recv.create.${recvNodeId}`, {
        user: viewer,
        room,
      }),
    );

    await this.nodeManagerService.addNodeForRoom(room, recvNodeId);

    return { ...response, recvNodeId };
  }

  async consume(viewer: string, room: string, recvNodeId: string) {
    if (this.nodeManagerService.isRoomPipedTo(room, recvNodeId)) {
      await this.piperService.pipeRoomToNode(room, recvNodeId);
    }
  }
}