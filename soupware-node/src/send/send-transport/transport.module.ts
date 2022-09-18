import { Module } from '@nestjs/common';
import { ProducerModule } from '../producer';
import { SendRouterModule } from '../send-router';
import { SendTransportService } from './transport.service';

@Module({
  imports: [SendRouterModule, ProducerModule],
  providers: [SendTransportService],
  controllers: [],
  exports: [SendTransportService],
})
export class SendTransportModule {}
