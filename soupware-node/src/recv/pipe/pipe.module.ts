import { Module } from '@nestjs/common';
import { PipeController } from './pipe.controller';
import { PipeService } from './pipe.service';

@Module({
  imports: [],
  providers: [PipeService],
  controllers: [PipeController],
  exports: [PipeService],
})
export class PipeModule {}
