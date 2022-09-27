import { Body, Controller, Post, Put } from '@nestjs/common';
import { ViewerService } from './viewer.service';

type CreateConsumerDto = {
  user: string;
  room: string;
  recvNodeId: string;
  rtpCapabilities: any;
};

type CreateViewerDto = {
  user: string;
  room: string;
};

type ConnectViewerDto = {
  user: string;
  room: string;
  dtls: any;
  recvNodeId: string;
};

@Controller()
export class ViewerController {
  constructor(private viewerService: ViewerService) {}

  @Put('/viewer')
  async onConnectViewer(
    @Body() { user, room, dtls, recvNodeId }: ConnectViewerDto,
  ) {
    return this.viewerService.connect(user, room, dtls, recvNodeId);
  }

  @Post('/viewer/consumer')
  async onCreateConsumer(
    @Body() { user, room, recvNodeId, rtpCapabilities }: CreateConsumerDto,
  ) {
    return this.viewerService.consume(user, room, recvNodeId, rtpCapabilities);
  }

  @Post('/viewer')
  async onCreateViewer(@Body() { user, room }: CreateViewerDto) {
    return this.viewerService.create(user, room);
  }
}
