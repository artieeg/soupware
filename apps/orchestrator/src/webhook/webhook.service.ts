import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import axios from 'axios';
import { ConsumerParams } from '@soupware/internals';

type WebhookName = 'producer-created' | 'producer-deleted' | 'audio-levels';

export type WebhookAudioLevels = {
  levels: Record<string, Record<string, number>>;
};

export type WebhookNewProducer = {
  consumers: {
    consumerParameters: ConsumerParams[];
    user: string;
  }[];
};

type WebhookPayload = WebhookNewProducer | WebhookAudioLevels;

type WebhookEvent<T extends WebhookPayload> = {
  name: WebhookName;
  payload: T;
};

@Injectable()
export class WebhookService {
  constructor(private configService: ConfigService) {}

  async post<T extends WebhookPayload>(event: WebhookEvent<T>) {
    const url = this.configService.get('SOUPWARE_WEBHOOK');
    const secret = this.configService.get('SOUPWARE_WEBHOOK_SECRET');

    // Create a signature
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(JSON.stringify(event));
    const signature = hmac.digest('hex');

    await axios.post(url, { event, signature });
  }
}
