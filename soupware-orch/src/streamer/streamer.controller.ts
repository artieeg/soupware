import { Body, Controller, Post, Put } from '@nestjs/common';
import { StreamerService } from './streamer.service';

type CreateStreamerDto = {
  user: string;
  room: string;
  oldPermissionToken?: string;
};

type ConnectStreamerDto = {
  dtlsParameters: any;
  rtpCapabilities: any;
  mediaPermissionToken: string;
};

type CreateProducerDto = {
  producerOptions: any;
  mediaPermissionToken: string;
};

@Controller()
export class StreamerController {
  constructor(private streamerService: StreamerService) {}

  @Post('/streamer')
  async onCreateStreamer(
    @Body() { user, room, oldPermissionToken }: CreateStreamerDto,
  ) {
    return this.streamerService.create(user, room, oldPermissionToken);
  }

  @Put('/streamer')
  async onConnectStreamer(
    @Body()
    {
      dtlsParameters,
      rtpCapabilities,
      mediaPermissionToken,
    }: ConnectStreamerDto,
  ) {
    return this.streamerService.connect(
      mediaPermissionToken,
      dtlsParameters,
      rtpCapabilities,
    );
  }

  @Post('/streamer/producer')
  async onCreateProducer(
    @Body() { producerOptions, mediaPermissionToken }: CreateProducerDto,
  ) {
    return this.streamerService.produce(mediaPermissionToken, producerOptions);
  }
}
