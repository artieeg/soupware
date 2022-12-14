import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MediaNodeLoad } from '@soupware/internals';
import { NodeManagerService } from './node-manager.service';

type NewNodeDto = {
  id: string;
  kind: string;
};

@Controller()
export class NodeManagerController {
  constructor(private nodeManagerService: NodeManagerService) {}

  @MessagePattern('soupware.node.del')
  async onDelNode(@Payload() { id, kind }: NewNodeDto) {
    return this.nodeManagerService.delNode(id, kind);
  }

  @MessagePattern('soupware.node.new')
  async onNewNode(@Payload() { id, kind }: NewNodeDto) {
    await this.nodeManagerService.addNode(id, kind);
  }

  @MessagePattern('soupware.node.load')
  async onNodeLoad(@Payload() data: MediaNodeLoad) {
    await this.nodeManagerService.updateNodeLoad(data);
  }
}
