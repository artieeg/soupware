import { Body, Controller, Delete, Post, Put } from '@nestjs/common';
import { StreamerService } from './streamer.service';

type DeleteProducerDto = {
  room: string;
  user: string;
  kinds: {
    audio?: boolean;
    video?: boolean;
  };
};

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

  @Delete('/streamer/producer')
  async onDeleteProducer(@Body() { user, room, kinds }: DeleteProducerDto) {
    console.log({ user, room, kinds });
    return this.streamerService.closeUserProducers(user, room, kinds);
  }

  @Post('/streamer/producer')
  async onCreateProducer(
    @Body() { producerOptions, mediaPermissionToken }: CreateProducerDto,
  ) {
    return this.streamerService.produce(mediaPermissionToken, producerOptions);
  }
}
