import { mediaSoupConfig } from '@app/mediasoup.config';
import { PipeConsumerParams } from '@app/shared';
import { Injectable } from '@nestjs/common';
import { PipeTransport } from 'mediasoup/node/lib/PipeTransport';
import { Producer } from 'mediasoup/node/lib/Producer';
import { SrtpParameters } from 'mediasoup/node/lib/SrtpParameters';
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

  async pipeToEgressRouters(room_id: string, producer: Producer) {
    const bridgeRouter = this.routerService.getBridgeRouter();
    const egressRouters = this.routerService.getEgressRouters();

    const user_id = (producer.appData as any).user;

    const pipedProducer: RouterProducers = new Map();

    for (const router of egressRouters) {
      const r = await bridgeRouter.pipeToRouter({
        producerId: producer.id,
        router,
      });

      pipedProducer.set(router.id, r.pipeProducer!);
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
  }

  async createPipeProducers(
    room: string,
    originNodeId: string,
    consumerData: PipeConsumerParams[],
  ) {
    return Promise.all(
      consumerData.map((data) =>
        this.createPipeProducer(originNodeId, room, data),
      ),
    );
  }

  async createPipeProducer(
    originNodeId: string,
    room: string,
    params: PipeConsumerParams,
  ) {
    const pipeTransport = this.pipes.get(originNodeId);

    const producer = await pipeTransport.produce({
      id: params.id,
      kind: params.kind,
      rtpParameters: params.rtpParameters,
      appData: params.appData,
    });

    await this.pipeToEgressRouters(room, producer);

    return { producer: producer.id };
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
