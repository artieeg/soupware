import { Injectable } from '@nestjs/common';
import { RtpCapabilities } from 'mediasoup/node/lib/RtpParameters';
import { RoomService } from '../room/room.service';

@Injectable()
export class ConsumerService {
  constructor(private roomService: RoomService) {}

  async create(
    room_id: string,
    user_id: string,
    rtpCapabilities: RtpCapabilities,
  ) {
    const room = this.roomService.getRoom(room_id);

    const user = room.users.find((u) => u.id === user_id);

    const consumers = await Promise.all(
      room.producers.map((pipes) => {
        const producer = pipes.get(user.router.id);

        return user.transport.consume({
          rtpCapabilities,
          producerId: producer.id,
          paused: false,
        });
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
