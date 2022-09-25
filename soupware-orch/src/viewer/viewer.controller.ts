import { Body, Controller, Post } from '@nestjs/common';
import { ViewerService } from './viewer.service';

type CreateConsumerDto = {
  user: string;
  room: string;
  recvNodeId: string;
};

type CreateViewerDto = {
  user: string;
  room: string;
};

@Controller()
export class ViewerController {
  constructor(private viewerService: ViewerService) {}

  @Post('/viewer/consumer')
  async onCreateConsumer(
    @Body() { user, room, recvNodeId }: CreateConsumerDto,
  ) {
    return this.viewerService.consume(user, room, recvNodeId);
  }

  @Post('/viewer')
  async onCreateViewer(@Body() { user, room }: CreateViewerDto) {
    return this.viewerService.create(user, room);
  }
}
