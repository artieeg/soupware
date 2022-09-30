import { Body, Controller, Post, Put } from '@nestjs/common';
import { StreamerService } from './streamer.service';

type CreateStreamerDto = {
  user: string;
  room: string;
  oldPermissionToken?: string;
  permissions: {
    audio: boolean;
    video: boolean;
  };
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

type UpdatePermissionsDto = {
  mediaPermissionToken: string;
  permissions: {
    audio: boolean;
    video: boolean;
  };
};

@Controller()
export class StreamerController {
  constructor(private streamerService: StreamerService) {}

  @Post('/streamer')
  async onCreateStreamer(
    @Body() { user, room, oldPermissionToken, permissions }: CreateStreamerDto,
  ) {
    return this.streamerService.create(
      user,
      room,
      permissions,
      oldPermissionToken,
    );
  }

  @Put('/streamer/permissions')
  async onPermissionsUpdate(
    @Body() { mediaPermissionToken, permissions }: UpdatePermissionsDto,
  ) {
    return this.streamerService.updatePermissions(
      mediaPermissionToken,
      permissions,
    );
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
