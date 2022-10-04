import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { RoomService } from 'src/room';
import { RecorderPoolStore } from './recorder-pool.store';

@Injectable()
export class RecordingService {
  constructor(
    @Inject('RECORDER') private client: ClientProxy,
    private recorderPoolStore: RecorderPoolStore,
    private roomService: RoomService,
  ) {}

  async recordRoom(room: string) {
    const assignedSendNodes = await this.roomService.getNodesOfKindFor(
      room,
      'SEND',
    );

    const recordParams = await Promise.all(
      assignedSendNodes.map((sendNodeId) =>
        firstValueFrom(
          this.client.send(
            `soupware.send.plain-transport.create-consumers.${sendNodeId}`,
            {
              room,
            },
          ),
        ),
      ),
    );

    console.log(recordParams);

    return { status: 'ok', recordParams };
  }
}
