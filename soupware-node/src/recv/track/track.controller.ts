import { NODE_ID } from '@app/shared';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RtpCapabilities } from 'mediasoup/node/lib/RtpParameters';
import { TrackService } from './track.service';

@Controller()
export class TrackController {
  constructor(private trackService: TrackService) {}

  @MessagePattern(`soupware.recv.track.consume.${NODE_ID}`)
  async onConsumeTrackRequest({
    room,
    user,
    rtpCapabilities,
  }: {
    room: string;
    user: string;
    rtpCapabilities: RtpCapabilities;
  }) {
    return this.trackService.consumeTrack(room, user, rtpCapabilities);
  }

  @MessagePattern(`soupware.recv.track.close-all-tracks-for-user.${NODE_ID}`)
  async onCloseAllTracksForUser({
    room,
    user,
  }: {
    room: string;
    user: string;
  }) {
    return this.trackService.closeAllTracksForUser(room, user);
  }

  @MessagePattern(
    `soupware.recv.track.close-tracks-produced-by-user.${NODE_ID}`,
  )
  async onDeleteTracksProducedByUser({
    room,
    user,
    to_unpublish: disabled_consumer,
  }: {
    room: string;
    user: string;
    to_unpublish: { audio: boolean; video: boolean };
  }) {
    return this.trackService.closeTracksProducedByUser(
      room,
      user,
      disabled_consumer,
    );
  }
}
