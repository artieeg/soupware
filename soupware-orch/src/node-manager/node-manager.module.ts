import { Module } from '@nestjs/common';
import { NodeManagerController } from './node-manager.controller';
import { NodeManagerService } from './node-manager.service';

@Module({
  imports: [],
  providers: [NodeManagerService],
  controllers: [NodeManagerController],
  exports: [],
})
export class NodeManagerModule {}
