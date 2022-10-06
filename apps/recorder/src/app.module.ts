import { Module } from '@nestjs/common';
import { EventEmitter } from 'events';
import { RecorderModule } from './recorder/recorder.module';
import { NestEmitterModule } from 'nest-emitter';
import { UploaderModule } from './uploader/uploader.module';

@Module({
  imports: [
    NestEmitterModule.forRoot(new EventEmitter()),
    RecorderModule,
    UploaderModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
