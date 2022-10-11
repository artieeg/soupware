import { Module } from '@nestjs/common';
import { SendPipeModule } from '../pipe';
import { ReencoderModule } from '../reencoder';
import { RoomModule } from '../room';
import { ProducerController } from './producer.controller';
import { ProducerService } from './producer.service';

@Module({
  imports: [RoomModule, SendPipeModule, ReencoderModule],
  providers: [ProducerService],
  controllers: [ProducerController],
  exports: [],
})
export class ProducerModule {}
