import { Module } from '@nestjs/common';
import { PermissionTokenService } from './permission-token.service';

@Module({
  imports: [],
  providers: [PermissionTokenService],
  controllers: [],
  exports: [PermissionTokenService],
})
export class PermissionTokenModule {}
