import { NODE_ID } from '@app/shared';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class SendPipeController {
  constructor() {}

  @MessagePattern(`soupware.pipe.send.${NODE_ID}`)
  async onCreatePipe({
    room,
    targetRecvNodeId,
  }: {
    room: string;
    targetRecvNodeId: string;
  }) {
    console.log('piping', room, 'to', targetRecvNodeId);
    return { status: 'ok' };
  }
}
