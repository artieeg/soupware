import { Body, Controller, Post, Put } from '@nestjs/common';
import { StreamerService } from './streamer.service';

type CreateStreamerDto = {
  user: string;
  room: string;
};

type ConnectStreamerDto = {
  user: string;
  dtlsParameters: any;
  sendNodeId: string;
  room: string;
};

type CreateProducerDto = {
  user: string;
  producerOptions: any;
  sendNodeId: string;
  room: string;
};

@Controller()
export class StreamerController {
  constructor(private streamerService: StreamerService) {}

  @Post('/streamer')
  async onCreateStreamer(@Body() { user, room }: CreateStreamerDto) {
    return this.streamerService.create(user, room);
  }

  @Put('/streamer')
  async onConnectStreamer(
    @Body() { dtlsParameters, sendNodeId, user, room }: ConnectStreamerDto,
  ) {
    return this.streamerService.connect(sendNodeId, user, room, dtlsParameters);
  }

  @Post('/streamer/producer')
  async onCreateProducer(
    @Body() { producerOptions, user, sendNodeId, room }: CreateProducerDto,
  ) {
    return this.streamerService.produce(
      user,
      room,
      sendNodeId,
      producerOptions,
    );
  }
}
