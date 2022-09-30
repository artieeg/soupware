import { NODE_ID } from '@app/shared';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { SendPipeService } from './pipe.service';

@Controller()
export class SendPipeController {
  constructor(private sendPipeService: SendPipeService) {}

  @MessagePattern(`soupware.pipe.send.${NODE_ID}`)
  async onCreatePipe({
    room: room_id,
    targetRecvNodeId,
  }: {
    room: string;
    targetRecvNodeId: string;
  }) {
    return this.sendPipeService.pipeRoomProducers(room_id, targetRecvNodeId);
  }
}
