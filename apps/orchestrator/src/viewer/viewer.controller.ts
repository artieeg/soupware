import { Body, Controller, Delete, Post, Put } from '@nestjs/common';
import { RtpCapabilities } from 'mediasoup/node/lib/RtpParameters';
import { ViewerService } from './viewer.service';

type DeleteConsumerDto = {
  room: string;
  user: string;
};

type CreateConsumerDto = {
  mediaPermissionToken: string;
  rtpCapabilities: any;
};

type CreateViewerDto = {
  user: string;
  room: string;
  rtpCapabilities: RtpCapabilities;
};

type ConnectViewerDto = {
  mediaPermissionToken: string;
  dtls: any;
};

@Controller()
export class ViewerController {
  constructor(private viewerService: ViewerService) {}

  @Put('/viewer')
  async onConnectViewer(
    @Body() { mediaPermissionToken, dtls }: ConnectViewerDto,
  ) {
    return this.viewerService.connect(mediaPermissionToken, dtls);
  }

  @Post('/viewer/consumer')
  async onCreateConsumer(
    @Body() { mediaPermissionToken, rtpCapabilities }: CreateConsumerDto,
  ) {
    return this.viewerService.consume(mediaPermissionToken, rtpCapabilities);
  }

  @Post('/viewer')
  async onCreateViewer(
    @Body() { user, room, rtpCapabilities }: CreateViewerDto,
  ) {
    return this.viewerService.create(user, room, rtpCapabilities);
  }

  @Delete('/viewer/consumer')
  async onDeleteConsumer(@Body() { user, room }: DeleteConsumerDto) {
    return this.viewerService.closeUserConsumers(user, room);
  }
}
