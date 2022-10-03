import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MediaNodeLoad } from '@soupware/internals';
import { NodeManagerService } from 'src/node-manager';
import { RoomService } from 'src/room';

@Injectable()
export class LoadBalancerService {
  private CPU_THRESHOLD: number;
  private BANDWIDTH_BUFFER: number;

  constructor(
    private configService: ConfigService,
    private nodeManagerService: NodeManagerService,
    private roomService: RoomService,
  ) {
    this.CPU_THRESHOLD = this.configService.get('SOUPWARE_NODE_CPU_THRESHOLD');
    this.BANDWIDTH_BUFFER = this.configService.get(
      'SOUPWARE_BANDWIDTH_BUFFER_BPS',
    );
  }

  getAvailableNodes(nodes: MediaNodeLoad[], kind: 'SEND' | 'RECV') {
    return nodes
      .filter((node) => {
        if (!node.max_bandwidth) {
          return true;
        }

        if (kind === 'SEND') {
          return (
            node.bandwidth.inbound < node.max_bandwidth - this.BANDWIDTH_BUFFER
          );
        } else {
          return (
            node.bandwidth.outbound < node.max_bandwidth - this.BANDWIDTH_BUFFER
          );
        }
      })
      .filter((node) => {
        return node.cpu < this.CPU_THRESHOLD;
      })
      .sort((a, b) => {
        return a.cpu - b.cpu;
      });
  }

  async getBestNodeFor(room: string, kind: 'SEND' | 'RECV'): Promise<string> {
    const assignedNodeIds = await this.roomService.getNodesOfKindFor(
      room,
      kind,
    );

    const assignedNodeInfo = await this.nodeManagerService.getInfoForNodes(
      assignedNodeIds,
    );

    const rankedAssignedNodes = this.getAvailableNodes(assignedNodeInfo, kind);
    const bestAssignedNode = rankedAssignedNodes[0];

    if (!bestAssignedNode) {
      const availableNodeInfo = await this.nodeManagerService.getAvailableNodes(
        kind,
        assignedNodeIds,
      );

      const rankedAvailableNodes = this.getAvailableNodes(
        availableNodeInfo,
        kind,
      );

      return rankedAvailableNodes[0].id;
    } else {
      return bestAssignedNode.id;
    }
  }
}
