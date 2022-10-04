import { RoomModule } from '../room';
import { Module } from '@nestjs/common';
import { RecvRouterModule } from '../recv-router';
import { RecvTransportService } from './recv-transport.service';
import { RecvTransportController } from './recv-transport.controller';

@Module({
  imports: [RecvRouterModule, RoomModule],
  providers: [RecvTransportService],
  controllers: [RecvTransportController],
  exports: [],
})
export class RecvTransportModule {}
