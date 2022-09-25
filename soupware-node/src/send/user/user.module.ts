import { Module } from '@nestjs/common';
import { UserService } from './user.service';

@Module({
  imports: [],
  providers: [UserService],
  controllers: [],
  exports: [UserService],
})
export class UserModule {}
