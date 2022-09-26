import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NodeManagerModule } from 'src/node-manager';
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
    NodeManagerModule,
    PiperModule,
  ],
  providers: [ViewerService],
  controllers: [ViewerController],
  exports: [],
})
export class ViewerModule {}