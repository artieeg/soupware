import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiTokenModule } from './api-token/api-token.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ['.env.local'], isGlobal: true }),
    ApiTokenModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
