import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ProducerParams, MediaPermission } from '@soupware/internals';
import { ProducerOptions } from 'mediasoup/node/lib/Producer';
import { firstValueFrom } from 'rxjs';
import { LoadBalancerService } from 'src/load-balancer';
import { PermissionTokenService } from 'src/permission-token';
import { RoomService } from 'src/room/room.service';
import { WebhookService } from 'src/webhook';

@Injectable()
export class StreamerService implements OnApplicationBootstrap {
  constructor(
    @Inject('MEDIA_NODE') private client: ClientProxy,
    private loadBalancerService: LoadBalancerService,
    private roomService: RoomService,
    private webhookService: WebhookService,
    private permissionTokenService: PermissionTokenService,
  ) {}

  async onApplicationBootstrap() {
    await this.client.connect();
  }

  async create(
    streamer: string,
    room: string,
    permissions: { audio: boolean; video: boolean },
    oldPermissionToken?: string,
  ) {
    const sendNodeId = await this.loadBalancerService.getBestNodeFor(
      room,
      'SEND',
    );

    const response = await firstValueFrom(
      this.client.send(`soupware.transport.send.create.${sendNodeId}`, {
        user: streamer,
        room,
      }),
    );

    await this.roomService.addNodeForRoom(room, sendNodeId);

    let mediaPermissionToken: string;

    const createNewToken = () =>
      this.permissionTokenService.create({
        room,
        user: streamer,
        sendNodeId,
        produce: permissions,
      });

    const updateOldToken = (oldTokenData: MediaPermission) =>
      this.permissionTokenService.update(oldPermissionToken, {
        ...oldTokenData,
        sendNodeId,
        produce: permissions,
      });

    if (oldPermissionToken) {
      const oldTokenData =
        this.permissionTokenService.decode(oldPermissionToken);
      if (oldTokenData.room !== room) {
        mediaPermissionToken = createNewToken();
      } else {
        mediaPermissionToken = updateOldToken(oldTokenData);
      }
    } else {
      mediaPermissionToken = createNewToken();
    }

    return { ...response, mediaPermissionToken };
  }

  async updatePermissions(
    token: string,
    newPermissions: { audio: boolean; video: boolean },
  ) {
    const tokenData = this.permissionTokenService.decode(token);

    // If video permission got revoked, delete producers
    if (tokenData.produce.video === true && newPermissions.video === false) {
      await this.deleteProducer(tokenData.user, tokenData.room, {
        video: true,
      });
    }

    // If audio permission got revoked, delete producers
    if (tokenData.produce.audio === true && newPermissions.audio === false) {
      await this.deleteProducer(tokenData.user, tokenData.room, {
        audio: true,
      });
    }

    const newToken = this.permissionTokenService.update(token, {
      ...tokenData,
      produce: newPermissions,
    });

    return newToken;
  }

  async connect(token: string, dtlsParameters: any, rtpCapabilities: any) {
    const { sendNodeId, user, room } =
      this.permissionTokenService.decode(token);

    await firstValueFrom(
      this.client.send(`soupware.transport.send.connect.${sendNodeId}`, {
        user,
        dtls: dtlsParameters,
        room,
        rtpCapabilities,
      }),
    );
  }

  async produce(token: string, producerOptions: ProducerOptions) {
    const { sendNodeId, user, room, produce } =
      this.permissionTokenService.decode(token);

    if (!produce[producerOptions.kind]) {
      throw new Error('Permission denied');
    }

    const params: ProducerParams = await firstValueFrom(
      this.client.send(`soupware.producer.create.${sendNodeId}`, {
        user,
        producerOptions,
        room,
      }),
    );

    return params;
  }

  async deleteProducer(
    user_id: string,
    room_id: string,
    { audio, video }: { audio?: boolean; video?: boolean },
  ) {
    const sendNodeIds = await this.roomService.getNodesOfKindFor(
      room_id,
      'SEND',
    );

    //Delete producers
    await Promise.all([
      sendNodeIds.map((sendNodeId) =>
        firstValueFrom(
          this.client.send(`soupware.producer.delete.${sendNodeId}`, {
            user: user_id,
            room: room_id,
            deleted_producer: { audio, video },
          }),
        ),
      ),
    ]);

    //Close pipe producers on recv nodes
    const recvNodeIds = await this.roomService.getNodesOfKindFor(
      room_id,
      'RECV',
    );

    await Promise.all([
      recvNodeIds.map((recvNodeId) =>
        firstValueFrom(
          this.client.send(`soupware.pipe.recv.close-pipe.${recvNodeId}`, {
            user: user_id,
            room: room_id,
            to_unpublish: { audio, video },
          }),
        ),
      ),
    ]);
  }
}
