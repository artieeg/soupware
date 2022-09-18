import { mediaSoupConfig } from '@app/mediasoup.config';
import { Injectable } from '@nestjs/common';
import { DtlsParameters } from 'mediasoup/node/lib/WebRtcTransport';
import { SendRouterService } from '../send-router';
import { ConnectTransportOptions } from './types';
import { ProducerService } from '../producer';

@Injectable()
export class SendTransportService {
  constructor(
    private sendRouterService: SendRouterService,
    private producerService: ProducerService,
  ) {}

  async connectSendTransport({
    sender: sender_id,
    dtls,
  }: {
    sender: string;
    dtls: DtlsParameters;
  }) {
    const sender = this.producerService.get(sender_id);

    await sender.transport.connect({ dtlsParameters: dtls });
  }

  async createSendTransport(sender: string): Promise<ConnectTransportOptions> {
    const router = this.sendRouterService.getRouter();

    const { listenIps, initialAvailableOutgoingBitrate } =
      mediaSoupConfig.webRtcTransport;

    const transport = await router.createWebRtcTransport({
      listenIps: listenIps,
      enableUdp: true,
      enableTcp: true,
      preferUdp: true,
      initialAvailableOutgoingBitrate: initialAvailableOutgoingBitrate,
      appData: { user: sender, direction: 'send' },
    });

    this.producerService.create(sender, transport);

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
