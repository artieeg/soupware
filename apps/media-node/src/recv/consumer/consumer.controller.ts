import { NODE_ID } from '@app/shared';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RtpCapabilities } from 'mediasoup/node/lib/RtpParameters';
import { ConsumerService } from './consumer.service';

@Controller()
export class ConsumerController {
  constructor(private consumerService: ConsumerService) {}

  @MessagePattern(`soupware.consumer.close-all.${NODE_ID}`)
  async onCloseAllConsumers({ room, user }: { room: string; user: string }) {
    return this.consumerService.removeUserFromRoom(room, user);
  }

  @MessagePattern(`soupware.consumer.create.${NODE_ID}`)
  async onCreateConsumer({
    room,
    user,
    rtpCapabilities,
  }: {
    room: string;
    user: string;
    rtpCapabilities: RtpCapabilities;
  }) {
    return this.consumerService.create(room, user, rtpCapabilities);
  }
}
