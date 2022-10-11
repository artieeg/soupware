import { NODE_ID } from '@app/shared';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RtpCapabilities } from 'mediasoup/node/lib/RtpParameters';
import { DtlsParameters } from 'mediasoup/node/lib/WebRtcTransport';
import { RecvTransportService } from './recv-transport.service';

@Controller()
export class RecvTransportController {
  constructor(private recvTransportService: RecvTransportService) {}

  @MessagePattern(`soupware.transport.recv.connect.${NODE_ID}`)
  async onConnectTransport({
    user,
    room,
    dtls,
  }: {
    user: string;
    room: string;
    dtls: DtlsParameters;
  }) {
    return this.recvTransportService.connectRecvTransport(user, room, dtls);
  }

  @MessagePattern(`soupware.transport.recv.create.${NODE_ID}`)
  async onCreateTransport({ user, room }: { user: string; room: string }) {
    const transportConnectParams =
      await this.recvTransportService.createRecvTransport(user, room);

    return { transportConnectParams };
  }
}
