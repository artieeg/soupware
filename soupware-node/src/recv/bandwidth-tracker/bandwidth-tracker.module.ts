import { Module } from '@nestjs/common';
import { BandwidthTrackerController } from './bandwidth-tracker.controller';
import { RecvBandwidthTrackerService } from './bandwidth-tracker.service';

@Module({
  imports: [],
  providers: [RecvBandwidthTrackerService],
  controllers: [BandwidthTrackerController],
  exports: [RecvBandwidthTrackerService],
})
export class RecvBandwidthTrackerModule {}
