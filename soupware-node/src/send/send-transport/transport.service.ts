import { mediaSoupConfig } from '@app/mediasoup.config';
import { Injectable } from '@nestjs/common';
import { DtlsParameters } from 'mediasoup/node/lib/WebRtcTransport';
import { SendRouterService } from '../send-router';
import { ConnectTransportOptions } from './types';
import { RoomService } from '../room';

@Injectable()
export class SendTransportService {
  constructor(
    private sendRouterService: SendRouterService,
    private roomService: RoomService,
  ) {}

  async connectSendTransport({
    room,
    user: user_id,
    dtls,
  }: {
    room: string;
    user: string;
    dtls: DtlsParameters;
  }) {
    const sender = this.roomService
      .get(room)
      .users.find((u) => u.id === user_id);

    await sender.transport.connect({ dtlsParameters: dtls });
  }

  async createSendTransport(
    room: string,
    user: string,
  ): Promise<ConnectTransportOptions> {
    const router = this.sendRouterService.getRouter();

    const { listenIps, initialAvailableOutgoingBitrate } =
      mediaSoupConfig.webRtcTransport;

    const transport = await router.createWebRtcTransport({
      listenIps: listenIps,
      enableUdp: true,
      enableTcp: true,
      preferUdp: true,
      initialAvailableOutgoingBitrate: initialAvailableOutgoingBitrate,
      appData: { user, room, direction: 'send' },
    });

    this.roomService.create(room, user, transport);

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
