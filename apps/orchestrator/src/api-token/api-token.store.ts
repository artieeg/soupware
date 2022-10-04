import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import IORedis, { Redis } from 'ioredis';

@Injectable()
export class ApiTokenStore implements OnModuleInit {
  private redis: Redis;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.redis = new IORedis(this.configService.get('API_TOKEN_STORE_ADDR'));
  }

  async save(token: string) {
    await this.redis.set(token, Date.now());
  }

  async exists(token: string) {
    const created_at = await this.redis.get(token);

    return !!created_at;
  }
}
