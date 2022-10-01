import { mediaSoupConfig } from '@app/mediasoup.config';
import { NODE_ID, PipeConsumerParams } from '@app/shared';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PipeTransport } from 'mediasoup/node/lib/PipeTransport';
import { InjectEventEmitter } from 'nest-emitter';
import { firstValueFrom } from 'rxjs';
import { RoomService } from '../room';
import { Room, User } from '../room/types';
import { SendRouterService } from '../send-router';
import { SendEventEmitter } from '../send.events';
import { SoupwarePipeConsumer, SoupwareSendProducer } from '../types';
import { createPipeConsumer } from '../utils';

@Injectable()
export class SendPipeService {
  private pipes: Map<string, PipeTransport>;

  constructor(
    @Inject('MEDIA_NODE') private client: ClientProxy,
    private routerService: SendRouterService,
    private roomService: RoomService,
    @InjectEventEmitter() private readonly eventEmitter: SendEventEmitter,
  ) {
    this.pipes = new Map();
  }

  async pipeNewProducer(producer: SoupwareSendProducer) {
    const room = producer.appData.room;
    const { pipes: pipedRecvNodeIds } = this.roomService.get(room);

    for (const recvNodeId of pipedRecvNodeIds) {
      const pipeTransport = await this.getPipeTo(recvNodeId);

      const consumer = await createPipeConsumer(pipeTransport, producer);

      await firstValueFrom(
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
    }
  }

  async pipeRoomProducers(room_id: string, targetRecvNodeId: string) {
    const room = this.roomService.get(room_id);
    const pipe = await this.getPipeTo(targetRecvNodeId);
    const producers = this.getRoomProducers(room);

    const pipeConsumers = await this.createPipeConsumers(pipe, producers);

    await firstValueFrom(
      this.client.send(`soupware.pipe.recv.producers.${targetRecvNodeId}`, {
        room: room_id,
        sendNodeId: NODE_ID,
        consumers: pipeConsumers.map((consumer) => ({
          id: consumer.id,
          kind: consumer.kind,
          rtpCapabilities: (consumer.appData.user as User).rtpCapabilities,
          rtpParameters: consumer.rtpParameters,
          appData: { user: (consumer.appData.user as any).id },
        })) as PipeConsumerParams[],
      }),
    );

    room.pipes.push(targetRecvNodeId);

    return { status: 'ok' };
  }

  private async createPipeConsumers(
    pipe: PipeTransport,
    producers: SoupwareSendProducer[],
  ): Promise<SoupwarePipeConsumer[]> {
    return Promise.all(
      producers.map((producer) => createPipeConsumer(pipe, producer)),
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

    this.pipes.set(targetRecvNodeId, pipeTransport);
    this.eventEmitter.emit('new-pipe', {
      transport: pipeTransport,
      targetRecvNodeId,
    });

    return pipeTransport;
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
      }, [] as SoupwareSendProducer[]);
  }
}
