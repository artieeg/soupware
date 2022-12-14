import { mediaSoupConfig } from '@app/mediasoup.config';
import { SoupwareProducer, PipeConsumerParams } from '@app/types';
import {
  pipeProducerToRouter,
  createPipeProducer,
  createNewConsumer,
} from '@app/utils';
import { Injectable } from '@nestjs/common';
import { ConsumerParams } from '@soupware/defs';
import { PipeTransport } from 'mediasoup/node/lib/PipeTransport';
import { SrtpParameters } from 'mediasoup/node/lib/SrtpParameters';
import { getConsumerParams } from '../consumer';
import { RecvRouterService } from '../recv-router';
import { RoomService } from '../room/room.service';
import { RouterProducers } from '../room/room.types';

@Injectable()
export class PipeService {
  private pipes: Map<string, PipeTransport>;

  constructor(
    private routerService: RecvRouterService,
    private roomService: RoomService,
  ) {
    this.pipes = new Map();
  }

  async closePipeProducer(
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

    return { status: 'ok' };
  }

  async pipeToEgressRouters(
    room_id: string,
    producer: SoupwareProducer,
  ): Promise<
    {
      consumerParameters: ConsumerParams;
      user: string;
    }[]
  > {
    const bridgeRouter = this.routerService.getBridgeRouter();
    const egressRouters = this.routerService.getEgressRouters();

    const user_id = producer.appData.user.id;

    const pipedProducer: RouterProducers = new Map();

    for (const router of egressRouters) {
      const routerProducer = await pipeProducerToRouter({
        sourceRouter: bridgeRouter,
        targetRouter: router,
        producer,
      });

      pipedProducer.set(router.id, routerProducer);
    }

    const room = this.roomService.getOrCreate(room_id);
    const oldRoomProducer = room.producers.get(user_id);
    room.producers.set(user_id, {
      ...oldRoomProducer,
      [producer.kind]: {
        router_producers: pipedProducer,
        pipe_producer: producer,
      },
    });

    return Promise.all(
      room.users
        //Filter out the user who published the producer and user that haven't connected their transport yet
        .filter(
          (user) =>
            user.id !== producer.appData.user.id && !!user.rtpCapabilities,
        )
        //Create a consumer for each user
        .map(async (user) => {
          const routerId = user.router.id;
          const routerProducer = pipedProducer.get(routerId);

          const consumer = await createNewConsumer(user.transport, {
            rtpCapabilities: user.rtpCapabilities,
            producerId: routerProducer.id,
            appData: producer.appData,
          });

          return {
            consumerParameters: getConsumerParams(consumer),
            user: user.id,
          };
        }),
    );
  }

  async createPipeProducers(
    room: string,
    originNodeId: string,
    consumerData: PipeConsumerParams[],
  ) {
    return Promise.all(
      consumerData.map((data) =>
        this.consumeRemoteProducer(originNodeId, room, data),
      ),
    );
  }

  async consumeRemoteProducer(
    originNodeId: string,
    room: string,
    params: PipeConsumerParams,
  ) {
    const pipeTransport = this.pipes.get(originNodeId);
    const producer = await createPipeProducer(pipeTransport, params);

    return this.pipeToEgressRouters(room, producer);
  }

  async connectRemotePipe(
    sendNodeId: string,
    originLocalIp: string,
    originLocalPort: number,
    originSrtpParameters: SrtpParameters,
  ) {
    const pipeTransport = await this.getPipeTransport();

    const {
      tuple: { localIp, localPort },
      srtpParameters,
    } = pipeTransport;

    await pipeTransport.connect({
      ip: originLocalIp,
      port: originLocalPort,
      srtpParameters: originSrtpParameters,
    });

    this.pipes.set(sendNodeId, pipeTransport);

    return {
      localIp,
      localPort,
      srtpParameters,
    };
  }

  private async getPipeTransport() {
    const router = this.routerService.getBridgeRouter();
    const transport = await router.createPipeTransport({
      listenIp: mediaSoupConfig.webRtcTransport.listenIps[0],
      enableRtx: true,
      enableSctp: true,
      enableSrtp: false,
    });

    return transport;
  }
}
