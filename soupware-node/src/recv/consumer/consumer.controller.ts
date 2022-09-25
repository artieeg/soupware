import { NODE_ID } from '@app/shared';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class ConsumerController {
  constructor() {}

  @MessagePattern(`soupware.consumer.create.${NODE_ID}`)
  async onCreateConsumer() {}
}
