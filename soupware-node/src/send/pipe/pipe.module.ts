import { Module } from '@nestjs/common';
import { SendPipeController } from './pipe.controller';
import { SendPipeService } from './pipe.service';

@Module({
  imports: [],
  providers: [SendPipeService],
  controllers: [SendPipeController],
  exports: [],
})
export class SendPipeModule {}
