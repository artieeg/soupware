import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RecorderController } from './recorder.controller';
import { RecorderService } from './recorder.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ORCHESTRATOR',
        transport: Transport.NATS,
        options: {
          servers: [process.env.NATS],
        },
      },
    ]),
  ],
  providers: [RecorderService],
  controllers: [RecorderController],
  exports: [],
})
export class RecorderModule {}
