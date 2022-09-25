import { mediaSoupConfig } from '@app/mediasoup.config';
import { Injectable } from '@nestjs/common';
import { DtlsParameters } from 'mediasoup/node/lib/WebRtcTransport';
import { SendRouterService } from '../send-router';
import { ConnectTransportOptions } from './types';
import { UserService } from '../user';

@Injectable()
export class SendTransportService {
  constructor(
    private sendRouterService: SendRouterService,
    private userService: UserService,
  ) {}

  async connectSendTransport({
    user: user_id,
    dtls,
  }: {
    user: string;
    dtls: DtlsParameters;
  }) {
    const sender = this.userService.get(user_id);

    await sender.transport.connect({ dtlsParameters: dtls });
  }

  async createSendTransport(user: string): Promise<ConnectTransportOptions> {
    const router = this.sendRouterService.getRouter();

    const { listenIps, initialAvailableOutgoingBitrate } =
      mediaSoupConfig.webRtcTransport;

    const transport = await router.createWebRtcTransport({
      listenIps: listenIps,
      enableUdp: true,
      enableTcp: true,
      preferUdp: true,
      initialAvailableOutgoingBitrate: initialAvailableOutgoingBitrate,
      appData: { user, direction: 'send' },
    });

    this.userService.create(user, transport);

    return {
      transportOptions: {
        id: transport.id,
        iceParameters: transport.iceParameters,
        iceCandidates: transport.iceCandidates,
        dtlsParameters: transport.dtlsParameters,
      },
      routerRtpParameters: router.rtpCapabilities,
    };
  }
}
