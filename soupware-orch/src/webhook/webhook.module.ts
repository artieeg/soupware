import { Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';

@Module({
  imports: [],
  providers: [WebhookService],
  controllers: [],
  exports: [WebhookService],
})
export class WebhookModule {}
