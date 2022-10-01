import { Module } from '@nestjs/common';
import { RoomModule } from '../room';
import { TrackController } from './track.controller';
import { TrackService } from './track.service';

@Module({
  imports: [RoomModule],
  providers: [TrackService],
  controllers: [TrackController],
  exports: [TrackService],
})
export class TrackModule {}
