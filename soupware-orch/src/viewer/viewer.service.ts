import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { DtlsParameters } from 'mediasoup/node/lib/WebRtcTransport';
import { firstValueFrom } from 'rxjs';
import { NodeManagerService } from 'src/node-manager';
import { PermissionTokenService } from 'src/permission-token';
import { PiperService } from 'src/piper';
import { RoomService } from 'src/room/room.service';

@Injectable()
export class ViewerService {
  constructor(
    @Inject('MEDIA_NODE') private client: ClientProxy,
    private roomService: RoomService,
    private nodeManagerService: NodeManagerService,
    private piperService: PiperService,
    private permissionTokenService: PermissionTokenService,
  ) {}

  async create(viewer: string, room: string) {
    const recvNodeId = await this.nodeManagerService.getNode('RECV');

    const response = await firstValueFrom(
      this.client.send(`soupware.transport.recv.create.${recvNodeId}`, {
        user: viewer,
        room,
      }),
    );

    await this.roomService.addNodeForRoom(room, recvNodeId);

    const mediaPermissionToken = this.permissionTokenService.create({
      room,
      user: viewer,
      recvNodeId,
    });

    return { ...response, mediaPermissionToken };
  }

  async consume(token: string, rtpCapabilities: any) {
    const { room, user, recvNodeId } =
      this.permissionTokenService.decode(token);

    if (this.roomService.isRoomPipedTo(room, recvNodeId)) {
      await this.piperService.pipeRoomToNode(room, recvNodeId);
    }

    const response = await firstValueFrom(
      this.client.send(`soupware.consumer.create.${recvNodeId}`, {
        room,
        user,
        rtpCapabilities,
      }),
    );

    return { consumerParameters: response };
  }

  async connect(token: string, dtls: DtlsParameters) {
    const { room, user, recvNodeId } =
      this.permissionTokenService.decode(token);

    const response = await firstValueFrom(
      this.client.send(`soupware.transport.recv.connect.${recvNodeId}`, {
        user,
        room,
        dtls,
      }),
    );

    return { response };
  }
}
