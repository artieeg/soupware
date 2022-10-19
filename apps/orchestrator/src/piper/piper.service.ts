import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { RoomService } from 'src/room/room.service';

@Injectable()
export class PiperService {
  constructor(
    @Inject('MEDIA_NODE') private client: ClientProxy,
    private roomService: RoomService,
  ) {}

  async pipeRoomToNode(room: string, targetRecvNodeId: string) {
    const sendNodeIds = await this.roomService.getNodesOfKindFor(room, 'SEND');

    const promises = sendNodeIds.map((node) => {
      return firstValueFrom(
        this.client.send(`soupware.pipe.send.${node}`, {
          room,
          targetRecvNodeId,
        }),
      );
    });

    await Promise.all(promises);

    await this.roomService.addRoomPipe(room, targetRecvNodeId);
  }
}
