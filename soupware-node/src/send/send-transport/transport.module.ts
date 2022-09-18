import { Module } from '@nestjs/common';
import { ProducerModule } from '../producer';
import { SendRouterModule } from '../send-router';
import { SendTransportController } from './transport.controller';
import { SendTransportService } from './transport.service';

@Module({
  imports: [SendRouterModule, ProducerModule],
  providers: [SendTransportService],
  controllers: [SendTransportController],
  exports: [SendTransportService],
})
export class SendTransportModule {}
