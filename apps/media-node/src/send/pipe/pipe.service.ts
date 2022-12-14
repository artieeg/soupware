import { mediaSoupConfig } from '@app/mediasoup.config';
import { NODE_ID } from '@app/shared';
import {
  SoupwareProducer,
  PipeConsumerParams,
  SoupwareConsumer,
} from '@app/types';
import { createPipeConsumer } from '@app/utils';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PipeTransport } from 'mediasoup/node/lib/PipeTransport';
import { InjectEventEmitter } from 'nest-emitter';
import { firstValueFrom } from 'rxjs';
import { RoomService } from '../room';
import { Room, User } from '../room/types';
import { SendRouterService } from '../send-router';
import { SendEventEmitter } from '../send.events';

@Injectable()
export class SendPipeService {
  private pipes: Map<
    string,
    {
      transport: PipeTransport;
      producers: SoupwareProducer[];
    }
  >;

  constructor(
    @Inject('MEDIA_NODE') private client: ClientProxy,
    private routerService: SendRouterService,
    private roomService: RoomService,
    @InjectEventEmitter() private readonly eventEmitter: SendEventEmitter,
  ) {
    this.pipes = new Map();
  }

  async pipeNewProducer(producer: SoupwareProducer) {
    const room = producer.appData.room;
    const { pipes: pipedRecvNodeIds } = this.roomService.get(room);

    const consumers = (
      await Promise.all(
        pipedRecvNodeIds.map(async (recvNodeId) => {
          const pipe = await this.getPipeTo(recvNodeId);

          const consumer = await createPipeConsumer(pipe.transport, producer);

          return firstValueFrom(
            this.client.send(`soupware.pipe.recv.producer.${recvNodeId}`, {
              consumer: {
                id: consumer.id,
                kind: consumer.kind,
                rtpCapabilities: consumer.appData.user.rtpCapabilities,
                rtpParameters: consumer.rtpParameters,
                appData: producer.appData,
              } as PipeConsumerParams,
              room,
              sendNodeId: NODE_ID,
            }),
          );
        }),
      )
    ).flat();

    return { consumers };
  }

  async pipeRoomProducers(room_id: string, targetRecvNodeId: string) {
    const room = this.roomService.get(room_id);
    const pipe = await this.getPipeTo(targetRecvNodeId);

    //Get producers that aren't piped yet
    const producers = this.getRoomProducers(room).filter((producer) => {
      return !pipe.producers.includes(producer);
    });

    const pipeConsumers = await this.createPipeConsumers(
      pipe.transport,
      producers,
    );

    await firstValueFrom(
      this.client.send(`soupware.pipe.recv.producers.${targetRecvNodeId}`, {
        room: room_id,
        sendNodeId: NODE_ID,
        consumers: pipeConsumers.map((consumer) => ({
          id: consumer.id,
          kind: consumer.kind,
          rtpCapabilities: (consumer.appData.user as User).rtpCapabilities,
          rtpParameters: consumer.rtpParameters,
          appData: { user: consumer.appData.user },
        })) as PipeConsumerParams[],
      }),
    );

    room.pipes.push(targetRecvNodeId);

    return { status: 'ok' };
  }

  private async createPipeConsumers(
    pipe: PipeTransport,
    producers: SoupwareProducer[],
  ): Promise<SoupwareConsumer[]> {
    return Promise.all(
      producers.map((producer) => {
        return createPipeConsumer(pipe, producer);
      }),
    );
  }

  private async getPipeTo(node: string) {
    if (this.pipes.has(node)) {
      return this.pipes.get(node);
    } else {
      return this.createNewPipe(node);
    }
  }

  private async createNewPipe(targetRecvNodeId: string) {
    const pipeTransport = await this.getPipeTransport();

    const {
      tuple: { localIp, localPort },
      srtpParameters,
    } = pipeTransport;

    const {
      localIp: recvLocalIp,
      localPort: recvLocalPort,
      srtpParameters: recvSrtpParameters,
    } = await firstValueFrom(
      this.client.send(`soupware.pipe.recv.${targetRecvNodeId}`, {
        originNodeId: NODE_ID,
        localIp,
        localPort,
        srtpParameters,
      }),
    );

    await pipeTransport.connect({
      ip: recvLocalIp,
      port: recvLocalPort,
      srtpParameters: recvSrtpParameters,
    });

    this.pipes.set(targetRecvNodeId, {
      transport: pipeTransport,
      producers: [],
    });

    this.eventEmitter.emit('new-pipe', {
      transport: pipeTransport,
      targetRecvNodeId,
    });

    return this.pipes.get(targetRecvNodeId);
  }

  private async getPipeTransport() {
    const router = this.routerService.getRouter();

    const transport = await router.createPipeTransport({
      listenIp: mediaSoupConfig.webRtcTransport.listenIps[0],

      enableRtx: true,
      enableSctp: true,
      enableSrtp: false,
    });

    return transport;
  }

  private getRoomProducers(room: Room) {
    return room.users
      .map((user) => user.producers)
      .reduce((p, c) => {
        const r = [...p];

        if (c.audio) r.push(c.audio);
        if (c.video) r.push(c.video);

        return r;
      }, [] as SoupwareProducer[]);
  }
}
