import { NODE_ID } from '@app/shared';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ProducerOptions } from 'mediasoup/node/lib/Producer';
import { ProducerService } from './producer.service';

@Controller()
export class ProducerController {
  constructor(private producerService: ProducerService) {}

  @MessagePattern(`soupware.producer.create.${NODE_ID}`)
  async onProducerCreate({
    user,
    producerOptions,
    room,
  }: {
    producerOptions: ProducerOptions;
    user: string;
    room: string;
  }) {
    return this.producerService.create(room, user, producerOptions);
  }

  @MessagePattern(`soupware.producer.close.${NODE_ID}`)
  async onProducerDelete({
    user,
    room,
    to_close,
  }: {
    user: string;
    room: string;
    to_close: {
      audio?: boolean;
      video?: boolean;
    };
  }) {
    return this.producerService.close(room, user, to_close);
  }
}
