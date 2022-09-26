import { RoomModule } from '../room';
import { Module } from '@nestjs/common';
import { SendPipeController } from './pipe.controller';
import { SendPipeService } from './pipe.service';
import { SendRouterModule } from '../send-router';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    RoomModule,
    SendRouterModule,
    ClientsModule.register([
      {
        name: 'MEDIA_NODE',
        transport: Transport.NATS,
        options: {
          servers: [process.env.NATS],
        },
      },
    ]),
  ],
  providers: [SendPipeService],
  controllers: [SendPipeController],
  exports: [],
})
export class SendPipeModule {}
