import { Body, Controller, Post } from '@nestjs/common';
import { RecordingService } from './recording.service';

@Controller()
export class RecordingController {
  constructor(private recordingService: RecordingService) {}

  @Post('/recording')
  async onRecord(@Body() { room }: { room: string }) {
    return this.recordingService.recordRoom(room);
  }
}
