import { mediaSoupConfig } from '@app/mediasoup.config';
import { createPlainTransport } from '@app/utils';
import { Injectable } from '@nestjs/common';
import { RecordParams } from '@soupware/internals';
import { RoomService } from '../room';
import { SendRouterService } from '../send-router';
import { getRemoteRTPPort } from './utils';

@Injectable()
export class PlainTransportService {
  constructor(
    private roomService: RoomService,
    private sendRouterService: SendRouterService,
  ) {}

  async createPlainTransportConsumers(
    room_id: string,
  ): Promise<RecordParams[]> {
    const room = this.roomService.get(room_id);
    const router = this.sendRouterService.getRouter();

    // Create a plain transport for the room
    if (!room.plain_transport) {
      room.plain_transport = await createPlainTransport(router);
      const remoteRtpPort = await getRemoteRTPPort();
      room.plain_transport.appData.remoteRtpPort = remoteRtpPort;

      await room.plain_transport.connect({
        ip: mediaSoupConfig.plainTransport.listenIp.ip,
        port: remoteRtpPort,
      });
    }

    const transport = room.plain_transport!;

    const consumers = (
      await Promise.all(
        room.users.map(async (user) => {
          if (user.producers.audio) {
            user.plainConsumers.audio = await transport.consume({
              producerId: user.producers.audio.id,
              rtpCapabilities: router.rtpCapabilities,
              paused: false,
            });
            user.plainConsumers.audio.appData = { user: user.id };
          }

          if (user.producers.video) {
            user.plainConsumers.video = await transport.consume({
              producerId: user.producers.video.id,
              rtpCapabilities: router.rtpCapabilities,
              paused: false,
            });
            user.plainConsumers.video.appData = { user: user.id };
          }

          return Object.values(user.plainConsumers);
        }),
      )
    ).reduce((acc, val) => acc.concat(val), []);

    const videoCodec = router.rtpCapabilities.codecs?.find(
      (c) => c.mimeType.toLowerCase() === 'video/vp8',
    );

    const audioCodec = router.rtpCapabilities.codecs?.find(
      (c) => c.mimeType.toLowerCase() === 'audio/opus',
    );

    const recorderRtpCapabilities = {
      codecs: [videoCodec, audioCodec],
      rtcpFeedback: [],
    };

    return consumers.map((consumer) => ({
      remoteRtpPort: transport.appData.remoteRtpPort,
      localRtcpPort: transport.rtcpTuple
        ? transport.rtcpTuple.localPort
        : undefined,
      rtpCapabilities: recorderRtpCapabilities,
      rtpParameters: consumer.rtpParameters,
      room: room_id,
      user: consumer.appData.user as string,
    }));
  }
}
