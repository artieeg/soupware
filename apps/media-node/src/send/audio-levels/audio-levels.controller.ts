import { Controller } from '@nestjs/common';
import { InjectEventEmitter } from 'nest-emitter';
import { SendEventEmitter } from '../send.events';
import { AudioLevelsService } from './audio-levels.service';

@Controller()
export class AudioLevelsController {
  constructor(
    @InjectEventEmitter() private readonly sendEventEmitter: SendEventEmitter,
    private audioLevelService: AudioLevelsService,
  ) {
    this.sendEventEmitter.on('new-producer', ({ producer }) => {
      this.audioLevelService.track(producer);
    });

    this.sendEventEmitter.on('del-producer', ({ producer }) => {
      this.audioLevelService.stopTracking(producer);
    });
  }
}
