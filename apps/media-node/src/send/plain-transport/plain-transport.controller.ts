import { NODE_ID } from '@app/shared';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { PlainTransportService } from './plain-transport.service';

@Controller()
export class PlainTransportController {
  constructor(private plainTransportService: PlainTransportService) {}

  @MessagePattern(`soupware.send.plain-transport.create-consumers.${NODE_ID}`)
  async onCreateConsumers({ room }: { room: string }) {
    return this.plainTransportService.createPlainTransportConsumers(room);
  }
}
