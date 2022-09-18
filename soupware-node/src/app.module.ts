import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NodeInfoModule } from './shared';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.local',
      isGlobal: true,
    }),
    NodeInfoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
