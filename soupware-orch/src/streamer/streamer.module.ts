import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { LoadBalancerModule } from 'src/load-balancer';
import { NodeManagerModule } from 'src/node-manager';
import { PermissionTokenModule } from 'src/permission-token';
import { RoomModule } from 'src/room/room.module';
import { WebhookModule } from 'src/webhook';
import { StreamerController } from './streamer.controller';
import { StreamerService } from './streamer.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'MEDIA_NODE',
        transport: Transport.NATS,
        options: {
          servers: [process.env.NATS],
        },
      },
    ]),
    LoadBalancerModule,
    PermissionTokenModule,
    RoomModule,
    WebhookModule,
  ],
  providers: [StreamerService],
  controllers: [StreamerController],
  exports: [],
})
export class StreamerModule {}
