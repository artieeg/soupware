import { Module } from '@nestjs/common';
import { RoomModule } from '../room';
import { ProducerController } from './producer.controller';
import { ProducerService } from './producer.service';

@Module({
  imports: [RoomModule],
  providers: [ProducerService],
  controllers: [ProducerController],
  exports: [],
})
export class ProducerModule {}
