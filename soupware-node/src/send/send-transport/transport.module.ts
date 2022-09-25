import { Module } from '@nestjs/common';
import { UserModule } from '../user';
import { SendRouterModule } from '../send-router';
import { SendTransportController } from './transport.controller';
import { SendTransportService } from './transport.service';

@Module({
  imports: [SendRouterModule, UserModule],
  providers: [SendTransportService],
  controllers: [SendTransportController],
  exports: [SendTransportService],
})
export class SendTransportModule {}
