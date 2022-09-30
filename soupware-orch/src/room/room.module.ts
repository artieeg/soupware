import { Module } from '@nestjs/common';
import { RoomService } from './room.service';

@Module({
  imports: [],
  providers: [RoomService],
  controllers: [],
  exports: [RoomService],
})
export class RoomModule {}
