import { Module } from '@nestjs/common';
import { RoomModule } from '../room';
import { SendRouterModule } from '../send-router';
import { SendTransportController } from './transport.controller';
import { SendTransportService } from './transport.service';

@Module({
  imports: [SendRouterModule, RoomModule],
  providers: [SendTransportService],
  controllers: [SendTransportController],
  exports: [SendTransportService],
})
export class SendTransportModule {}
