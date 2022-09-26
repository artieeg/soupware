import { NODE_ID } from '@app/shared';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { SrtpParameters } from 'mediasoup/node/lib/SrtpParameters';
import { PipeService } from './pipe.service';

@Controller()
export class PipeController {
  constructor(private pipeService: PipeService) {}

  @MessagePattern(`soupware.pipe.recv.${NODE_ID}`)
  async onCreatePipe({
    localIp,
    localPort,
    originNodeId,
    srtpParameters,
  }: {
    localIp: string;
    localPort: number;
    originNodeId: string;
    srtpParameters: SrtpParameters;
  }) {
    return this.pipeService.pipe(
      originNodeId,
      localIp,
      localPort,
      srtpParameters,
    );
  }
}
