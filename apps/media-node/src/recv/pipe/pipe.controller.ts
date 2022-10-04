import { NODE_ID } from '@app/shared';
import { PipeConsumerParams } from '@app/types';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { SrtpParameters } from 'mediasoup/node/lib/SrtpParameters';
import { PipeService } from './pipe.service';

@Controller()
export class PipeController {
  constructor(private pipeService: PipeService) {}

  @MessagePattern(`soupware.pipe.recv.close-pipe.${NODE_ID}`)
  async onClosePipe({
    room,
    user,
    to_unpublish: disabled_consumer,
  }: {
    room: string;
    user: string;
    to_unpublish: { audio: boolean; video: boolean };
  }) {
    return this.pipeService.closePipeProducer(room, user, disabled_consumer);
  }

  @MessagePattern(`soupware.pipe.recv.producer.${NODE_ID}`)
  async onNewProducer({
    room,
    sendNodeId,
    consumer,
  }: {
    room: string;
    sendNodeId: string;
    consumer: PipeConsumerParams;
  }) {
    return this.pipeService.consumeRemoteProducer(sendNodeId, room, consumer);
  }

  @MessagePattern(`soupware.pipe.recv.producers.${NODE_ID}`)
  async onCreatePipeProducers({
    room,
    sendNodeId,
    consumers,
  }: {
    room: string;
    sendNodeId: string;
    consumers: PipeConsumerParams[];
  }) {
    return this.pipeService.createPipeProducers(room, sendNodeId, consumers);
  }

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
    return this.pipeService.connectRemotePipe(
      originNodeId,
      localIp,
      localPort,
      srtpParameters,
    );
  }
}
