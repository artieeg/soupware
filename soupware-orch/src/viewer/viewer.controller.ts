import { Body, Controller, Post } from '@nestjs/common';
import { ViewerService } from './viewer.service';

type CreateViewerDto = {
  user: string;
  room: string;
};

@Controller()
export class ViewerController {
  constructor(private viewerService: ViewerService) {}

  @Post('/viewer')
  async onCreateViewer(@Body() { user, room }: CreateViewerDto) {
    return this.viewerService.create(user, room);
  }
}
