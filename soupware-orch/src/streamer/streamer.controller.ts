import { Body, Controller, Post } from '@nestjs/common';
import { StreamerService } from './streamer.service';

type CreateStreamerDto = {
  streamer: string;
};

@Controller()
export class StreamerController {
  constructor(private streamerService: StreamerService) {}

  @Post('/streamer')
  async onCreateStreamer(@Body() { streamer }: CreateStreamerDto) {
    return this.streamerService.create(streamer);
  }
}
