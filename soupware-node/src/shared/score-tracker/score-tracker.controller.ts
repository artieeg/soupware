import { RecvEventEmitter } from '@app/recv/recv.events';
import { Controller } from '@nestjs/common';
import { InjectEventEmitter } from 'nest-emitter';
import { SendEventEmitter } from '@app/send/send.events';
import { ScoreTrackerService } from './score-tracker.service';

@Controller()
export class ScoreTrackerController {
  constructor(
    private scoreTrackerService: ScoreTrackerService,
    @InjectEventEmitter() private readonly sendEventEmitter: SendEventEmitter,
    @InjectEventEmitter() private readonly recvEventEmitter: RecvEventEmitter,
  ) {
    this.sendEventEmitter.on('new-producer', ({ producer }) => {
      this.scoreTrackerService.addProducer(producer);
    });

    this.recvEventEmitter.on('new-consumer', ({ consumer }) => {
      this.scoreTrackerService.addConsumer(consumer);
    });
  }
}
