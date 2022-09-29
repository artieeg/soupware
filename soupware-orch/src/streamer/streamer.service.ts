import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ProducerParams, MediaPermission } from '@soupware/shared';
import { firstValueFrom } from 'rxjs';
import { NodeManagerService } from 'src/node-manager';
import { PermissionTokenService } from 'src/permission-token';
import { WebhookService } from 'src/webhook';

@Injectable()
export class StreamerService implements OnApplicationBootstrap {
  constructor(
    @Inject('MEDIA_NODE') private client: ClientProxy,
    private nodeManagerService: NodeManagerService,
    private webhookService: WebhookService,
    private permissionTokenService: PermissionTokenService,
  ) {}

  async onApplicationBootstrap() {
    await this.client.connect();
  }

  async create(streamer: string, room: string, oldPermissionToken?: string) {
    const sendNodeId = await this.nodeManagerService.getNode('SEND');

    const response = await firstValueFrom(
      this.client.send(`soupware.transport.send.create.${sendNodeId}`, {
        user: streamer,
        room,
      }),
    );

    await this.nodeManagerService.addNodeForRoom(room, sendNodeId);

    let mediaPermissionToken: string;

    const createNewToken = () =>
      this.permissionTokenService.create({
        room,
        user: streamer,
        sendNodeId,
        produce: { video: true, audio: true },
      });

    const updateOldToken = (oldTokenData: MediaPermission) =>
      this.permissionTokenService.update(oldPermissionToken, {
        ...oldTokenData,
        sendNodeId,
        produce: { audio: true, video: true },
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

  async produce(token: string, producerOptions: any) {
    const { sendNodeId, user, room } =
      this.permissionTokenService.decode(token);

    const params: ProducerParams = await firstValueFrom(
      this.client.send(`soupware.producer.create.${sendNodeId}`, {
        user,
        producerOptions,
        room,
      }),
    );

    return params;
  }
}
