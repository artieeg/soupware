import { Module } from '@nestjs/common';
import { RecvRouterService } from './recv-router.service';

@Module({
  imports: [],
  providers: [RecvRouterService],
  controllers: [],
  exports: [RecvRouterService],
})
export class RecvRouterModule {}
