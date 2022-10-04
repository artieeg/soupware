import { RecvEventEmitter } from '@app/recv/recv.events';
import { Controller } from '@nestjs/common';
import { InjectEventEmitter } from 'nest-emitter';
import { SendEventEmitter } from '@app/send/send.events';
import { BandwidthTrackerService } from './bandwidth-tracker.service';

@Controller()
export class BandwidthTrackerController {
  constructor(
    private bandwidthTrackerService: BandwidthTrackerService,
    @InjectEventEmitter() private readonly sendEventEmitter: SendEventEmitter,
    @InjectEventEmitter() private readonly recvEventEmitter: RecvEventEmitter,
  ) {
    this.sendEventEmitter.on('new-producer', ({ producer }) => {
      this.bandwidthTrackerService.track(producer);
    });

    this.recvEventEmitter.on('new-consumer', ({ consumer }) => {
      this.bandwidthTrackerService.track(consumer);
    });
  }
}
