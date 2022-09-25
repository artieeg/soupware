import { Module } from '@nestjs/common';
import { PipeService } from './pipe.service';

@Module({
  imports: [],
  providers: [PipeService],
  controllers: [],
  exports: [PipeService],
})
export class PipeModule {}
