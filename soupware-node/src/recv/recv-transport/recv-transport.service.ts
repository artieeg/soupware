import { mediaSoupConfig } from '@app/mediasoup.config';
import { Injectable } from '@nestjs/common';
import { RecvRouterService } from '../recv-router';
import { RoomService } from '../room/room.service';

@Injectable()
export class RecvTransportService {
  constructor(
    private recvRouterService: RecvRouterService,
    private roomService: RoomService,
  ) {}

  async createRecvTransport(user: string, room_id: string) {
    const router = this.recvRouterService.getNextRouter();

    const { listenIps, initialAvailableOutgoingBitrate } =
      mediaSoupConfig.webRtcTransport;

    const transport = await router.createWebRtcTransport({
      listenIps: listenIps,
      enableUdp: true,
      enableTcp: true,
      preferUdp: true,
      initialAvailableOutgoingBitrate: initialAvailableOutgoingBitrate,
      appData: { user, room: room_id, direction: 'send' },
    });

    const room = this.roomService.getOrCreate(room_id);
    room.users.push({
      id: user,
      transport,
      router,
      consumers: [],
    });

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
