import { Module } from '@nestjs/common';
import { SendRouterService } from './send-router.service';

@Module({
  imports: [],
  providers: [SendRouterService],
  controllers: [],
  exports: [SendRouterService],
})
export class SendRouterModule {}
