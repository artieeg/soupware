import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RoomModule } from 'src/room/room.module';
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
    RoomModule,
  ],
  providers: [PiperService],
  controllers: [],
  exports: [PiperService],
})
export class PiperModule {}
