import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RoomModule } from 'src/room';
import { RecorderPoolStore } from './recorder-pool.store';
import { RecordingController } from './recording.controller';
import { RecordingService } from './recording.service';

@Module({
  imports: [
    RoomModule,
    ClientsModule.register([
      {
        name: 'RECORDER',
        transport: Transport.NATS,
        options: {
          servers: [process.env.NATS],
        },
      },
    ]),
  ],
  providers: [RecordingService, RecorderPoolStore],
  controllers: [RecordingController],
  exports: [RecordingService],
})
export class RecordingModule {}
