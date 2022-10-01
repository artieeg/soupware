import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MediaNodeLoad } from '@soupware/internals';
import { NodeManagerService } from 'src/node-manager';
import { RoomService } from 'src/room';

@Injectable()
export class LoadBalancerService {
  private CPU_THRESHOLD: number;

  constructor(
    private configService: ConfigService,
    private nodeManagerService: NodeManagerService,
    private roomService: RoomService,
  ) {
    this.CPU_THRESHOLD = this.configService.get('SOUPWARE_NODE_CPU_THRESHOLD');
  }

  async getBestNodeFor(room: string, kind: 'SEND' | 'RECV'): Promise<string> {
    const assignedNodeIds = await this.roomService.getNodesOfKindFor(
      room,
      kind,
    );

    const assignedNodeInfo = await this.nodeManagerService.getInfoForNodes(
      assignedNodeIds,
    );

    // Find node with minimal cpu load
    const nodeWithMinimalLoad: MediaNodeLoad | undefined =
      assignedNodeInfo.reduce((acc, node) => {
        if (node.cpu < acc.cpu) {
          return node;
        }

        return acc;
      }, assignedNodeInfo[0]);

    if (!nodeWithMinimalLoad || nodeWithMinimalLoad.cpu > this.CPU_THRESHOLD) {
      const availableNodeInfo = await this.nodeManagerService.getAvailableNodes(
        kind,
        assignedNodeIds,
      );

      // Find available node with minimal cpu load
      const availableNodeWithMinimalLoad: MediaNodeLoad =
        availableNodeInfo.reduce((acc, node) => {
          if (node.cpu < acc.cpu) {
            return node;
          }

          return acc;
        }, availableNodeInfo[0]);

      return availableNodeWithMinimalLoad.id;
    } else {
      return nodeWithMinimalLoad.id;
    }
  }
}
