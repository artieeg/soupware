import { Module } from '@nestjs/common';
import { SendRouterModule } from '../send-router';
import { SenderModule } from '../sender';
import { SendTransportService } from './transport.service';

@Module({
  imports: [SendRouterModule, SenderModule],
  providers: [SendTransportService],
  controllers: [],
  exports: [SendTransportService],
})
export class SendTransportModule {}
