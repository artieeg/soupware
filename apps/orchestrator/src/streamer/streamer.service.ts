import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MediaPermission } from '@soupware/internals';
import {
  UserParams,
  TransportConnectParams,
  WebhookNewProducer,
} from '@soupware/defs';
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
    private permissionTokenService: PermissionTokenService,
    private webhookService: WebhookService,
  ) {}

  async onApplicationBootstrap() {
    await this.client.connect();
  }

  async create(
    streamer: string,
    room: string,
    permissions: { audio: boolean; video: boolean },
    oldPermissionToken?: string,
  ): Promise<UserParams> {
    const sendNodeId = await this.loadBalancerService.getBestNodeFor(
      room,
      'SEND',
    );

    const response: TransportConnectParams = await firstValueFrom(
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

    return { transportConnectParams: response, mediaPermissionToken };
  }

  async updatePermissions(
    token: string,
    newPermissions: { audio: boolean; video: boolean },
  ) {
    const tokenData = this.permissionTokenService.decode(token);

    // If video permission got revoked, delete producers
    if (tokenData.produce.video === true && newPermissions.video === false) {
      await this.closeUserProducers(tokenData.user, tokenData.room, {
        video: true,
      });
    }

    // If audio permission got revoked, delete producers
    if (tokenData.produce.audio === true && newPermissions.audio === false) {
      await this.closeUserProducers(tokenData.user, tokenData.room, {
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

    const { producerParams, consumers } = await firstValueFrom(
      this.client.send(`soupware.producer.create.${sendNodeId}`, {
        user,
        producerOptions,
        room,
      }),
    );

    this.webhookService.post<WebhookNewProducer>({
      name: 'producer-created',
      payload: {
        consumers,
      },
    });

    return producerParams;
  }

  async closeUserProducers(
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
          this.client.send(`soupware.producer.close.${sendNodeId}`, {
            user: user_id,
            room: room_id,
            to_close: { audio, video },
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
