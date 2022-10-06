import { createNewConsumer } from '@app/utils';
import { Injectable } from '@nestjs/common';
import { ConsumerParams } from '@soupware/internals';
import { RtpCapabilities } from 'mediasoup/node/lib/RtpParameters';
import { InjectEventEmitter } from 'nest-emitter';
import { RecvEventEmitter } from '../recv.events';
import { RoomService } from '../room/room.service';
import { getConsumerParams } from './utils';

@Injectable()
export class ConsumerService {
  constructor(
    private roomService: RoomService,
    @InjectEventEmitter() private readonly emitter: RecvEventEmitter,
  ) {}

  async removeUserFromRoom(room_id: string, user_id: string) {
    const room = this.roomService.getRoom(room_id);
    const user = room.users.find((u) => u.id === user_id);

    //Close user's consumers
    user.consumers.forEach((c) => c.close());

    //Delete the user
    room.users = room.users.filter((u) => u.id !== user_id);

    return { status: 'ok' };
  }

  async create(
    room_id: string,
    user_id: string,
    rtpCapabilities: RtpCapabilities,
  ): Promise<{ consumerParameters: ConsumerParams }[]> {
    const room = this.roomService.getRoom(room_id);

    const user = room.users.find((u) => u.id === user_id);

    const roomProducersArray = [...room.producers.values()];

    const consumers = await Promise.all(
      roomProducersArray.map(async ({ audio, video }) => {
        const consumers = [];
        if (video) {
          const producer = video.router_producers.get(user.router.id);

          const consumer = await createNewConsumer(user.transport, {
            rtpCapabilities,
            producerId: producer.id,
            appData: producer.appData,
          });

          this.emitter.emit('new-consumer', {
            consumer,
            room: room_id,
            user: user_id,
          });
          consumers.push(consumer);
        }

        if (audio) {
          const producer = audio.router_producers.get(user.router.id);

          const consumer = await createNewConsumer(user.transport, {
            rtpCapabilities,
            producerId: producer.id,
            appData: producer.appData,
          });

          this.emitter.emit('new-consumer', {
            consumer,
            room: room_id,
            user: user_id,
          });
          consumers.push(consumer);
        }

        user.consumers.push(...consumers);

        return consumers;
      }),
    );

    return consumers
      .reduce((prev, acc) => prev.concat(acc), [])
      .map((consumer) => ({
        consumerParameters: getConsumerParams(consumer),
      }));
  }
}
