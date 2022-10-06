import { Controller } from '@nestjs/common';
import { UploaderService } from './uploader.service';
import { InjectEventEmitter } from 'nest-emitter';
import { RecorderEventEmitter } from 'src/types';

@Controller()
export class UploaderController {
  constructor(
    private uploaderService: UploaderService,
    @InjectEventEmitter() private readonly eventEmitter: RecorderEventEmitter,
  ) {
    this.eventEmitter.on('recording:ready', ({ room, files }) => {
      this.uploaderService.uploadRoomRecordings(room, files);
    });
  }
}
