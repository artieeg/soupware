import { NODE_ID } from '@app/shared';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { DtlsParameters } from 'mediasoup/node/lib/WebRtcTransport';
import { SendTransportService } from './transport.service';

@Controller()
export class SendTransportController {
  constructor(private sendTransportService: SendTransportService) {}

  //@MessagePattern(`soupware.transport.connect.${NODE_ID}`)
  @MessagePattern(`soupware.transport.connect`)
  async onConnectTransport({
    dtls,
    user,
  }: {
    dtls: DtlsParameters;
    user: string;
  }) {
    await this.sendTransportService.connectSendTransport({ user, dtls });
  }

  @MessagePattern(`soupware.transport.create`)
  async onCreateTransport(@Payload() { user }: { user: string }) {
    const transportConnectParams =
      await this.sendTransportService.createSendTransport(user);

    return { transportConnectParams };
  }
}
