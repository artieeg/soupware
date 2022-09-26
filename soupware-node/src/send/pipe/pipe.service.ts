import { mediaSoupConfig } from '@app/mediasoup.config';
import { NODE_ID } from '@app/shared';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PipeTransport } from 'mediasoup/node/lib/PipeTransport';
import { Producer } from 'mediasoup/node/lib/Producer';
import { firstValueFrom } from 'rxjs';
import { RoomService } from '../room';
import { Room } from '../room/types';
import { SendRouterService } from '../send-router';

@Injectable()
export class SendPipeService {
  private pipes: Map<string, PipeTransport>;

  constructor(
    @Inject('MEDIA_NODE') private client: ClientProxy,
    private routerService: SendRouterService,
    private roomService: RoomService,
  ) {
    this.pipes = new Map();
  }

  async pipeMediaRoom(room_id: string, targetRecvNodeId: string) {
    const room = this.roomService.get(room_id);
    const pipe = await this.getPipeTo(targetRecvNodeId);
    const producers = this.getRoomProducers(room);

    const pipeConsumers = await this.createPipeConsumers(pipe, producers);

    console.log({ producers, pipeConsumers });

    return { status: 'ok' };
  }

  private async createPipeConsumers(
    pipe: PipeTransport,
    producers: Producer[],
  ) {
    return Promise.all(
      producers.map((producer) => pipe.consume({ producerId: producer.id })),
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
      }, []);
  }
}
