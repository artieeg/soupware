import { NODE_ID } from '@app/shared';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RtpCapabilities } from 'mediasoup/node/lib/RtpParameters';
import { DtlsParameters } from 'mediasoup/node/lib/WebRtcTransport';
import { SendTransportService } from './transport.service';

@Controller()
export class SendTransportController {
  constructor(private sendTransportService: SendTransportService) {}

  @MessagePattern(`soupware.transport.send.connect.${NODE_ID}`)
  async onConnectTransport({
    dtls,
    user,
    room,
    rtpCapabilities,
  }: {
    room: string;
    dtls: DtlsParameters;
    rtpCapabilities: RtpCapabilities;
    user: string;
  }) {
    await this.sendTransportService.connectSendTransport({
      room,
      user,
      dtls,
      rtpCapabilities,
    });

    return { status: 'ok' };
  }

  @MessagePattern(`soupware.transport.send.create.${NODE_ID}`)
  async onCreateTransport({ user, room }: { user: string; room: string }) {
    const transportConnectParams =
      await this.sendTransportService.createSendTransport(room, user);

    return { transportConnectParams };
  }
}
