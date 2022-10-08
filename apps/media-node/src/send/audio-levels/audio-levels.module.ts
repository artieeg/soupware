import { Module } from '@nestjs/common';
import { SendRouterModule } from '../send-router';
import { AudioLevelsController } from './audio-levels.controller';
import { AudioLevelsService } from './audio-levels.service';

@Module({
  imports: [SendRouterModule],
  providers: [AudioLevelsService],
  controllers: [AudioLevelsController],
  exports: [],
})
export class AudioLevelsModule {}
