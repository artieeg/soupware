import { createNewProducer } from '@app/utils';
import { Injectable } from '@nestjs/common';
import { ProducerParams } from '@soupware/internals';
import { ProducerOptions } from 'mediasoup/node/lib/Producer';
import { InjectEventEmitter } from 'nest-emitter';
import { SendPipeService } from '../pipe';
import { RoomService } from '../room';
import { SendEventEmitter } from '../send.events';

@Injectable()
export class ProducerService {
  constructor(
    private roomService: RoomService,
    private sendPipeService: SendPipeService,
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
  ): Promise<ProducerParams> {
    const user = this.roomService.getUser(room, user_id);
    const producer = await createNewProducer(user.transport, {
      ...options,
      appData: {
        user: user_id,
        room,
      },
    });

    user.producers[producer.kind] = producer;

    await this.sendPipeService.pipeNewProducer(producer);

    this.emitter.emit('new-producer', { producer, room, user: user_id });

    return {
      id: producer.id,
      kind: producer.kind,
      rtpParameters: producer.rtpParameters,
    };
  }
}
