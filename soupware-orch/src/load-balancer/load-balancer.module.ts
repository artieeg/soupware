import { Module } from '@nestjs/common';
import { NodeManagerModule } from 'src/node-manager';
import { RoomModule } from 'src/room';
import { LoadBalancerService } from './load-balancer.service';

@Module({
  imports: [NodeManagerModule, RoomModule],
  providers: [LoadBalancerService],
  controllers: [],
  exports: [LoadBalancerService],
})
export class LoadBalancerModule {}
