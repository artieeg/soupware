import { Injectable } from '@nestjs/common';
import { RtpCapabilities } from 'mediasoup/node/lib/RtpParameters';
import { InjectEventEmitter } from 'nest-emitter';
import { RecvEventEmitter } from '../recv.events';
import { RoomService } from '../room/room.service';

@Injectable()
export class TrackService {
  constructor(
    private roomService: RoomService,
    @InjectEventEmitter() private readonly emitter: RecvEventEmitter,
  ) {}

  async closeAllTracksForUser(room_id: string, user_id: string) {
    const room = this.roomService.getRoom(room_id);
    const user = room.users.find((u) => u.id === user_id);

    //Close user's consumers
    user.consumers.forEach((c) => c.close());

    //Delete the user
    room.users = room.users.filter((u) => u.id !== user_id);

    return { status: 'ok' };
  }

  /**
   * Closes audio and/or video producers of a user,
   * automatically closes consumers in egress routers
   * */
  async closeTracksProducedByUser(
    room_id: string,
    user_id: string,
    to_unpublish: { audio: boolean; video: boolean },
  ) {
    const room = this.roomService.getRoom(room_id);

    const roomProducer = room.producers.get(user_id);

    if (to_unpublish.video && roomProducer.video) {
      roomProducer.video.pipe_producer.close();
      roomProducer.video = undefined;
    }

    if (to_unpublish.audio && roomProducer.audio) {
      roomProducer.audio.pipe_producer.close();
      roomProducer.audio = undefined;
    }

    /*
    if (disabled_consumer.audio && disabled_consumer.video) {
      room.producers.delete(user_id);
    }
    */

    return { status: 'ok' };
  }

  async consumeTrack(
    room_id: string,
    user_id: string,
    rtpCapabilities: RtpCapabilities,
  ) {
    const room = this.roomService.getRoom(room_id);

    const user = room.users.find((u) => u.id === user_id);

    const roomProducersArray = [...room.producers.values()];

    const consumers = await Promise.all(
      roomProducersArray.map(async ({ audio, video }) => {
        const consumers = [];
        if (video) {
          const producer = video.router_producers.get(user.router.id);

          const consumer = await user.transport.consume({
            rtpCapabilities,
            producerId: producer.id,
            paused: false,
          });

          this.emitter.emit('new-track-consumer', {
            consumer,
            room: room_id,
            user: user_id,
          });
          consumers.push(consumer);
        }

        if (audio) {
          const producer = audio.router_producers.get(user.router.id);

          const consumer = await user.transport.consume({
            rtpCapabilities,
            producerId: producer.id,
            paused: false,
          });

          this.emitter.emit('new-track-consumer', {
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
