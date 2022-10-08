import { Module } from '@nestjs/common';
import { WebhookModule } from 'src/webhook';
import { AudioLevelsController } from './audio-levels.controller';
import { AudioLevelsService } from './audio-levels.service';

@Module({
  imports: [WebhookModule],
  providers: [AudioLevelsService],
  controllers: [AudioLevelsController],
  exports: [],
})
export class AudioLevelsModule {}
