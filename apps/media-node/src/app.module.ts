import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitter } from 'events';
import { NestEmitterModule } from 'nest-emitter';
import { SEND_NODE } from './constants';
import { ConsumerModule, RecvPipeModule, RecvTransportModule } from './recv';
import {
  SendRouterModule,
  SendTransportModule,
  RoomModule,
  SendPipeModule,
} from './send';
import { AudioLevelsModule } from './send/audio-levels';
import { PlainTransportModule } from './send/plain-transport/plain-transport.module';
import { ProducerModule } from './send/producer';
import {
  LoadReporterModule,
  BandwidthTrackerModule,
  NodeInfoModule,
} from './shared';
import { ScoreTrackerModule } from './shared/score-tracker/score-tracker.module';
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
  ScoreTrackerModule,
  NestEmitterModule.forRoot(new EventEmitter()),
];

const sendNodeModules = [
  RoomModule,
  SendPipeModule,
  SendRouterModule,
  SendTransportModule,
  ProducerModule,
  PlainTransportModule,
  AudioLevelsModule,
];

const recvNodeModules = [RecvTransportModule, RecvPipeModule, ConsumerModule];

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
