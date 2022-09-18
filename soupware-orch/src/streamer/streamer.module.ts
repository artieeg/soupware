import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
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
  ],
  providers: [StreamerService],
  controllers: [StreamerController],
  exports: [],
})
export class StreamerModule {}
