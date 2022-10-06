import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RequestRoomRecording } from '@soupware/internals';
import { RecorderService, RECORDER_ID } from './recorder.service';

@Controller()
export class RecorderController {
  constructor(private recorderService: RecorderService) {}

  @MessagePattern(`soupware.recorder.record-room.${RECORDER_ID}`)
  async onRecordRoom({ params }: RequestRoomRecording) {
    await this.recorderService.spawnRecorders(params);

    return {
      status: 'ok',
    };
  }
}
