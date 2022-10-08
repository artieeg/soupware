import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiTokenModule } from './api-token/api-token.module';
import { ConfigModule } from '@nestjs/config';
import { StreamerModule } from './streamer/streamer.module';
import { NodeManagerModule } from './node-manager';
import { ViewerModule } from './viewer';
import { WebhookModule } from './webhook';
import { RoomModule } from './room/room.module';
import { RecordingModule } from './recording/recording.module';
import { AudioLevelsModule } from './audio-levels/audio-levels.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ['.env.local'], isGlobal: true }),
    WebhookModule,
    ApiTokenModule,
    StreamerModule,
    ViewerModule,
    NodeManagerModule,
    RecordingModule,
    RoomModule,
    AudioLevelsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
