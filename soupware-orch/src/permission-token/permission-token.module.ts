import { Module } from '@nestjs/common';
import { PermissionService } from './permission-token.service';

@Module({
  imports: [],
  providers: [PermissionService],
  controllers: [],
  exports: [PermissionService],
})
export class PermissionTokenModule {}
