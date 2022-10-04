import { Body, Controller, Post } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RecorderPoolStore } from './recorder-pool.store';
import { RecordingService } from './recording.service';

@Controller()
export class RecordingController {
  constructor(
    private recordingService: RecordingService,
    private recorderPoolStore: RecorderPoolStore,
  ) {}

  @Post('/recording')
  async onRecord(@Body() { room }: { room: string }) {
    return this.recordingService.recordRoom(room);
  }

  @MessagePattern('soupware.recorder.new')
  async onNewRecorder({ recorderId }: { recorderId: string }) {
    await this.recorderPoolStore.addNewRecorder(recorderId);

    return { status: 'ok' };
  }
}
