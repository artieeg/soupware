import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NodeManagerModule } from 'src/node-manager';
import { PiperService } from './piper.service';

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
  ],
  providers: [PiperService],
  controllers: [],
  exports: [PiperService],
})
export class PiperModule {}
