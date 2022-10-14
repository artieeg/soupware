import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import axios from 'axios';
import { WebhookPayload, WebhookEvent } from '@soupware/shared';

@Injectable()
export class WebhookService {
  constructor(private configService: ConfigService) {}

  async post<T extends WebhookPayload>(event: WebhookEvent<T>) {
    const url = this.configService.get('SOUPWARE_WEBHOOK');
    if (!url) {
      return;
    }

    const secret = this.configService.get('SOUPWARE_WEBHOOK_SECRET');

    // Create a signature
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(JSON.stringify(event));
    const signature = hmac.digest('hex');

    await axios.post(url, { event, signature });
  }
}
