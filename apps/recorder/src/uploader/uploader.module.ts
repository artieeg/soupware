import { Module } from '@nestjs/common';
import { UploaderController } from './uploader.controller';
import { UploaderService } from './uploader.service';

@Module({
  imports: [],
  providers: [UploaderService],
  controllers: [UploaderController],
  exports: [],
})
export class UploaderModule {}
