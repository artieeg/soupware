import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiTokenModule } from './api-token/api-token.module';
import { ConfigModule } from '@nestjs/config';
import { StreamerModule } from './streamer/streamer.module';
import { NodeManagerModule } from './node-manager';
import { ViewerModule } from './viewer';
import { WebhookModule } from './webhook';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ['.env.local'], isGlobal: true }),
    WebhookModule,
    ApiTokenModule,
    StreamerModule,
    ViewerModule,
    NodeManagerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
