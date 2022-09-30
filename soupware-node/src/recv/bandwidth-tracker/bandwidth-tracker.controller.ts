import { Controller } from '@nestjs/common';
import { InjectEventEmitter } from 'nest-emitter';
import { RecvEventEmitter } from '../recv.events';
import { RecvBandwidthTrackerService } from './bandwidth-tracker.service';

@Controller()
export class BandwidthTrackerController {
  constructor(
    private bandwidthTrackerService: RecvBandwidthTrackerService,
    @InjectEventEmitter() private readonly emitter: RecvEventEmitter,
  ) {
    this.emitter.on('new-consumer', ({ consumer }) => {
      console.log('new-consumer', consumer);
      this.bandwidthTrackerService.track(consumer);
    });
  }
}
