import { Module } from '@nestjs/common';
import { BandwidthTrackerController } from './bandwidth-tracker.controller';
import { SendBandwidthTrackerService } from './bandwidth-tracker.service';

@Module({
  imports: [],
  providers: [SendBandwidthTrackerService],
  controllers: [BandwidthTrackerController],
  exports: [SendBandwidthTrackerService],
})
export class SendBandwidthTrackerModule {}
