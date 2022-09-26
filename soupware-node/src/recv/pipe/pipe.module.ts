import { Module } from '@nestjs/common';
import { RecvRouterModule } from '../recv-router';
import { PipeController } from './pipe.controller';
import { PipeService } from './pipe.service';

@Module({
  imports: [RecvRouterModule],
  providers: [PipeService],
  controllers: [PipeController],
  exports: [PipeService],
})
export class RecvPipeModule {}
