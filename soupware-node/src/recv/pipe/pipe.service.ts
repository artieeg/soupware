import { mediaSoupConfig } from '@app/mediasoup.config';
import { Injectable } from '@nestjs/common';
import { PipeTransport } from 'mediasoup/node/lib/PipeTransport';
import { SrtpParameters } from 'mediasoup/node/lib/SrtpParameters';
import { RecvRouterService } from '../recv-router';

@Injectable()
export class PipeService {
  private pipes: Map<string, PipeTransport>;

  constructor(private routerService: RecvRouterService) {
    this.pipes = new Map();
  }

  async pipe(
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
