import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NodeInfoService } from './node-info.service';

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
  providers: [NodeInfoService],
  controllers: [],
  exports: [NodeInfoService],
})
@Global()
export class NodeInfoModule {}
