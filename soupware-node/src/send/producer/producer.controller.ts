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
  }: {
    producerOptions: ProducerOptions;
    user: string;
  }) {
    return this.producerService.create(user, producerOptions);
  }
}
