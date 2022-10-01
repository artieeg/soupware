import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitter } from 'events';
import { NestEmitterModule } from 'nest-emitter';
import { SEND_NODE } from './constants';
import { TrackModule, RecvPipeModule, RecvTransportModule } from './recv';
import {
  SendRouterModule,
  SendTransportModule,
  RoomModule,
  SendPipeModule,
} from './send';
import { ProducerModule } from './send/producer';
import {
  LoadReporterModule,
  BandwidthTrackerModule,
  NodeInfoModule,
} from './shared';
import { NodeKind } from './types';

const shared = [
  ConfigModule.forRoot({
    envFilePath: '.env.local',
    isGlobal: true,
  }),
  NodeInfoModule,
  RecvTransportModule,
  BandwidthTrackerModule,
  LoadReporterModule,
  NestEmitterModule.forRoot(new EventEmitter()),
];

const sendNodeModules = [
  RoomModule,
  SendPipeModule,
  SendRouterModule,
  SendTransportModule,
  ProducerModule,
];

const recvNodeModules = [RecvTransportModule, RecvPipeModule, TrackModule];

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
