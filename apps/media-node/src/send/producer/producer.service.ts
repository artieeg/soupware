import { Injectable } from '@nestjs/common';
import { ProducerParams } from '@soupware/internals';
import { ProducerOptions } from 'mediasoup/node/lib/Producer';
import { InjectEventEmitter } from 'nest-emitter';
import { SendPipeService } from '../pipe';
import { RoomService } from '../room';
import { SendEventEmitter } from '../send.events';
import { createNewProducer } from '@app/utils';
import { ReencoderService } from '../reencoder';

@Injectable()
export class ProducerService {
  constructor(
    private roomService: RoomService,
    private sendPipeService: SendPipeService,
    private reencoderService: ReencoderService,
    @InjectEventEmitter() private readonly emitter: SendEventEmitter,
  ) {}

  close(
    room_id: string,
    user_id: string,
    to_close: {
      audio?: boolean;
      video?: boolean;
    },
  ) {
    const user = this.roomService.getUser(room_id, user_id);

    if (to_close.audio && user.producers.audio) {
      user.producers.audio.close();
      user.producers.audio = undefined;
    }

    if (to_close.video && user.producers.video) {
      user.producers.video.close();
      user.producers.video = undefined;
    }

    return { status: 'ok' };
  }

  async create(
    room: string,
    user_id: string,
    options: ProducerOptions,
  ): Promise<{
    producerParams: ProducerParams;
    consumers: any[];
  }> {
    const user = this.roomService.getUser(room, user_id);
    const _producer = await createNewProducer(user.transport, {
      ...options,
      keyFrameRequestDelay: 500,
      appData: {
        user,
        room,
      },
    });

    const producer = await this.reencoderService.reencode(_producer);

    //_producer.enableTraceEvent(['keyframe']);
    //producer.enableTraceEvent(['keyframe']);

    _producer.on('trace', (trace) => {
      console.log('orignal producer', trace);
    });

    _producer.on('trace', (trace) => {
      console.log('reencded producer', trace);
    });

    user.producers[producer.kind] = producer;

    const { consumers } = await this.sendPipeService.pipeNewProducer(producer);

    this.emitter.emit('new-producer', { producer, room, user: user_id });

    return {
      producerParams: {
        id: producer.id,
        kind: producer.kind,
        rtpParameters: producer.rtpParameters,
      },
      consumers,
    };
  }
}
