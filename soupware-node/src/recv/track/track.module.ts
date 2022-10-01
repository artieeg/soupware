import { Module } from '@nestjs/common';
import { RoomModule } from '../room';
import { TrackController } from './consumer.controller';
import { TrackService } from './consumer.service';

@Module({
  imports: [RoomModule],
  providers: [TrackService],
  controllers: [TrackController],
  exports: [TrackService],
})
export class TrackModule {}
