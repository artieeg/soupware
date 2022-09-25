import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { NodeManagerService } from 'src/node-manager';

@Injectable()
export class PiperService {
  constructor(
    @Inject('MEDIA_NODE') private client: ClientProxy,
    private nodeManagerService: NodeManagerService,
  ) {}

  async pipeRoomToNode(room: string, targetRecvNodeId: string) {
    const sendNodeIds = await this.nodeManagerService.getSendNodesFor(room);

    const promises = sendNodeIds.map((node) => {
      return firstValueFrom(
        this.client.send(`soupware.pipe.send.${node}`, {
          room,
          targetRecvNodeId,
        }),
      );
    });

    await Promise.all(promises);
  }
}
