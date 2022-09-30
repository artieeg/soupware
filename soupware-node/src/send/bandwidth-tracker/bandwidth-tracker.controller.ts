import { Controller } from '@nestjs/common';
import { InjectEventEmitter } from 'nest-emitter';
import { SendEventEmitter } from '../send.events';
import { SendBandwidthTrackerService } from './bandwidth-tracker.service';

@Controller()
export class BandwidthTrackerController {
  constructor(
    private bandwidthTrackerService: SendBandwidthTrackerService,
    @InjectEventEmitter() private readonly emitter: SendEventEmitter,
  ) {
    this.emitter.on('new-producer', ({ producer }) => {
      this.bandwidthTrackerService.track(producer);
    });
  }
}
