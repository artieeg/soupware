import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import crypto from 'crypto';
import axios from 'axios';

type WebhookName = 'producer-created' | 'producer-deleted';

export type WebhookNewProducer = {
  consumers: {
    consumerParameters: any[];
    user: string;
  }[];
};

type WebhookPayload = WebhookNewProducer;

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
