import { Module } from '@nestjs/common';
import { RoomModule } from '../room';
import { SendRouterModule } from '../send-router';
import { PlainTransportController } from './plain-transport.controller';
import { PlainTransportService } from './plain-transport.service';

@Module({
  imports: [RoomModule, SendRouterModule],
  providers: [PlainTransportService],
  controllers: [PlainTransportController],
  exports: [],
})
export class PlainTransportModule {}
