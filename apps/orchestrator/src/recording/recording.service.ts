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

    const recorderId = await this.recorderPoolStore.getRecorder();

    const flatRecordParams = recordParams.flat();

    await firstValueFrom(
      this.client.send(`soupware.recorder.record-room.${recorderId}`, {
        params: flatRecordParams,
      }),
    );

    await this.recorderPoolStore.setRecorderFor(room, recorderId);

    return { status: 'ok', recordParams };
  }

  async stopRecordingRoom(room: string) {
    const recorderId = await this.recorderPoolStore.getRecorderFor(room);

    await firstValueFrom(
      this.client.send(`soupware.recorder.stop-recording-room.${recorderId}`, {
        room,
      }),
    );
  }

  async stopRecordingUser(room: string, user: string) {
    const recorderId = await this.recorderPoolStore.getRecorderFor(room);

    await firstValueFrom(
      this.client.send(`soupware.recorder.stop-recording-user.${recorderId}`, {
        room,
        user,
      }),
    );
  }
}
