import { Module } from '@nestjs/common';
import { UserModule } from '../user';
import { ProducerController } from './producer.controller';
import { ProducerService } from './producer.service';

@Module({
  imports: [UserModule],
  providers: [ProducerService],
  controllers: [ProducerController],
  exports: [],
})
export class ProducerModule {}
