import { NODE_ID } from '@app/shared';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { DtlsParameters } from 'mediasoup/node/lib/WebRtcTransport';
import { SendTransportService } from './transport.service';

@Controller()
export class SendTransportController {
  constructor(private sendTransportService: SendTransportService) {}

  @MessagePattern(`soupware.transport.send.connect.${NODE_ID}`)
  async onConnectTransport({
    dtls,
    user,
  }: {
    dtls: DtlsParameters;
    user: string;
  }) {
    await this.sendTransportService.connectSendTransport({ user, dtls });

    return { status: 'ok' };
  }

  @MessagePattern(`soupware.transport.send.create.${NODE_ID}`)
  async onCreateTransport({ user }: { user: string }) {
    const transportConnectParams =
      await this.sendTransportService.createSendTransport(user);

    return { transportConnectParams };
  }
}
