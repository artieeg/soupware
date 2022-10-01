import { NODE_ID } from '@app/shared';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RtpCapabilities } from 'mediasoup/node/lib/RtpParameters';
import { ConsumerService } from './consumer.service';

@Controller()
export class ConsumerController {
  constructor(private consumerService: ConsumerService) {}

  @MessagePattern(`soupware.consumers.delete.${NODE_ID}`)
  async onDeleteConsumers({
    room,
    user,
    disabled_consumer,
  }: {
    room: string;
    user: string;
    disabled_consumer: { audio: boolean; video: boolean };
  }) {
    return this.consumerService.deleteRoomProducer(
      room,
      user,
      disabled_consumer,
    );
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
