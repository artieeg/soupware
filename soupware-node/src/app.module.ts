import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SEND_NODE } from './constants';
import { SendRouterModule, SendTransportModule, UserModule } from './send';
import { ProducerModule } from './send/producer';
import { NodeInfoModule } from './shared';
import { NodeKind } from './types';

const shared = [
  ConfigModule.forRoot({
    envFilePath: '.env.local',
    isGlobal: true,
  }),
  NodeInfoModule,
];

const sendNodeModules = [
  UserModule,
  SendRouterModule,
  SendTransportModule,
  ProducerModule,
];
const recvNodeModules = [];

const nodeKind = process.env.NODE_KIND as NodeKind;

@Module({
  imports: [
    ...shared,
    ...(nodeKind === SEND_NODE ? sendNodeModules : recvNodeModules),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
