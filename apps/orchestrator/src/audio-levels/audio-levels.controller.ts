import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AudioLevelEvent } from '@soupware/internals';
import { AudioLevelsService } from './audio-levels.service';

@Controller()
export class AudioLevelsController {
  constructor(private audioLevelService: AudioLevelsService) {}

  @MessagePattern('soupware.audio-levels')
  async onAudioLevels(levels: AudioLevelEvent) {
    this.audioLevelService.updateAudioLevels(levels);
  }
}
