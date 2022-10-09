import { Module } from '@nestjs/common';
import { SendRouterModule } from '../send-router';
import { ReencoderService } from './reencoder.service';

@Module({
  imports: [SendRouterModule],
  providers: [ReencoderService],
  controllers: [],
  exports: [ReencoderService],
})
export class ReencoderModule {}
