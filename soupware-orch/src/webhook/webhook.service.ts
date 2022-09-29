import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import crypto from 'crypto';
import axios from 'axios';

type WebhookName = 'track-published' | 'track-unpublished';

type TrackPublished = {
  user: string;
  room: string;
  track: any;
};

type WebhookPayload = TrackPublished;

type WebhookEvent = {
  name: WebhookName;
  payload: WebhookPayload;
};

@Injectable()
export class WebhookService {
  constructor(private configService: ConfigService) {}

  async post(event: WebhookEvent) {
    const url = this.configService.get('SOUPWARE_WEBHOOK');
    const secret = this.configService.get('SOUPWARE_WEBHOOK_SECRET');

    // Create a signature
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(JSON.stringify(event));
    const signature = hmac.digest('hex');

    await axios.post(url, { event, signature });
  }
}
