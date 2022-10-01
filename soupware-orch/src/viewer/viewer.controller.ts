import { Body, Controller, Delete, Post, Put } from '@nestjs/common';
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
  async onCreateViewer(@Body() { user, room }: CreateViewerDto) {
    return this.viewerService.create(user, room);
  }

  @Delete('/viewer/consumer')
  async onDeleteConsumer(@Body() { user, room }: DeleteConsumerDto) {
    return this.viewerService.closeUserConsumers(user, room);
  }
}
