import { Module } from '@nestjs/common';
import { ApiTokenController } from './api-token.controller';
import { ApiTokenService } from './api-token.service';
import { ApiTokenStore } from './api-token.store';

@Module({
  providers: [ApiTokenService, ApiTokenStore],
  controllers: [ApiTokenController],
})
export class ApiTokenModule {}
