import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SEND_NODE } from './constants';
import { RecvTransportModule } from './recv';
import { SendRouterModule, SendTransportModule, RoomModule } from './send';
import { ProducerModule } from './send/producer';
import { NodeInfoModule } from './shared';
import { NodeKind } from './types';

const shared = [
  ConfigModule.forRoot({
    envFilePath: '.env.local',
    isGlobal: true,
  }),
  NodeInfoModule,
  RecvTransportModule,
];

const sendNodeModules = [
  RoomModule,
  SendRouterModule,
  SendTransportModule,
  ProducerModule,
];

const recvNodeModules = [RecvTransportModule];

const nodeKind = process.env.NODE_KIND as NodeKind;

@Module({
  imports: [
    ...shared,
    ...(nodeKind === SEND_NODE ? sendNodeModules : recvNodeModules),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
