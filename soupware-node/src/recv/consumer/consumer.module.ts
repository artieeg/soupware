import { Module } from '@nestjs/common';
import { RecvRouterModule } from '../recv-router';
import { RoomModule } from '../room';
import { ConsumerController } from './consumer.controller';
import { ConsumerService } from './consumer.service';

@Module({
  imports: [RoomModule],
  providers: [ConsumerService],
  controllers: [ConsumerController],
  exports: [ConsumerService],
})
export class ConsumerModule {}
