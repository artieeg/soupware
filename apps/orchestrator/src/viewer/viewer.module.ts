import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { LoadBalancerModule } from 'src/load-balancer';
import { NodeManagerModule } from 'src/node-manager';
import { PermissionTokenModule } from 'src/permission-token';
import { RoomModule } from 'src/room/room.module';
import { PiperModule } from '../piper';
import { ViewerController } from './viewer.controller';
import { ViewerService } from './viewer.service';

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
    RoomModule,
    PermissionTokenModule,
    LoadBalancerModule,
    PiperModule,
  ],
  providers: [ViewerService],
  controllers: [ViewerController],
  exports: [],
})
export class ViewerModule {}
