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

  async create(
    room: string,
    user_id: string,
    options: ProducerOptions,
  ): Promise<ProducerParams> {
    const user = this.roomService.getUser(room, user_id);
    const producer = await user.transport.produce({
      ...options,
      appData: {
        user,
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
