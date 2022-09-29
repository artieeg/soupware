import { Injectable } from '@nestjs/common';
import { ProducerParams } from '@soupware/shared';
import { ProducerOptions } from 'mediasoup/node/lib/Producer';
import { RoomService } from '../room';

@Injectable()
export class ProducerService {
  constructor(private roomService: RoomService) {}

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
      },
    });

    user.producers[producer.kind] = producer;

    return {
      id: producer.id,
      kind: producer.kind,
      rtpParameters: producer.rtpParameters,
    };
  }
}
