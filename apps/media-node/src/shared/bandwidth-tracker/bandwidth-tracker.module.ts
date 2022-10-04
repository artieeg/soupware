import { Module } from '@nestjs/common';
import { BandwidthTrackerController } from './bandwidth-tracker.controller';
import { BandwidthTrackerService } from './bandwidth-tracker.service';

@Module({
  imports: [],
  providers: [BandwidthTrackerService],
  controllers: [BandwidthTrackerController],
  exports: [BandwidthTrackerService],
})
export class BandwidthTrackerModule {}
