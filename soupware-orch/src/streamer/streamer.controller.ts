import { Body, Controller, Post, Put } from '@nestjs/common';
import { StreamerService } from './streamer.service';

type CreateStreamerDto = {
  user: string;
};

type ConnectStreamerDto = {
  user: string;
  dtlsParameters: any;
  sendNodeId: string;
};

@Controller()
export class StreamerController {
  constructor(private streamerService: StreamerService) {}

  @Post('/streamer')
  async onCreateStreamer(@Body() { user }: CreateStreamerDto) {
    return this.streamerService.create(user);
  }

  @Put('/streamer')
  async onConnectStreamer(
    @Body() { dtlsParameters, sendNodeId, user }: ConnectStreamerDto,
  ) {
    return this.streamerService.connect(sendNodeId, user, dtlsParameters);
  }
}
