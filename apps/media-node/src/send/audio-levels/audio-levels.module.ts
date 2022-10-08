import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SendRouterModule } from '../send-router';
import { AudioLevelsController } from './audio-levels.controller';
import { AudioLevelsService } from './audio-levels.service';

@Module({
  imports: [
    SendRouterModule,
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
  providers: [AudioLevelsService],
  controllers: [AudioLevelsController],
  exports: [],
})
export class AudioLevelsModule {}
