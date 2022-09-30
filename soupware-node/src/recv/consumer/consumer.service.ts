import { Injectable } from '@nestjs/common';
import { RtpCapabilities } from 'mediasoup/node/lib/RtpParameters';
import { InjectEventEmitter } from 'nest-emitter';
import { RecvEventEmitter } from '../recv.events';
import { RoomService } from '../room/room.service';

@Injectable()
export class ConsumerService {
  constructor(
    private roomService: RoomService,
    @InjectEventEmitter() private readonly emitter: RecvEventEmitter,
  ) {}

  async create(
    room_id: string,
    user_id: string,
    rtpCapabilities: RtpCapabilities,
  ) {
    const room = this.roomService.getRoom(room_id);

    const user = room.users.find((u) => u.id === user_id);

    const consumers = await Promise.all(
      room.producers.map(async (pipes) => {
        const producer = pipes.get(user.router.id);

        const consumer = await user.transport.consume({
          rtpCapabilities,
          producerId: producer.id,
          paused: false,
        });

        this.emitter.emit('new-consumer', {
          consumer,
          room: room_id,
          user: user_id,
        });

        return consumer;
      }),
    );

    return consumers.map((consumer) => ({
      consumerParameters: {
        id: consumer.id,
        kind: consumer.kind,
        rtpParameters: consumer.rtpParameters,
        type: consumer.type,
        producerPaused: false,
        producerId: consumer.producerId,
      },
    }));
  }
}
