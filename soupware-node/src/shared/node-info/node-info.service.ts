import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { NodeKind } from '@app/types';
import { ClientProxy } from '@nestjs/microservices';

export const NODE_ID = `${process.env.NODE_KIND}_${nanoid()}`;

@Injectable()
export class NodeInfoService implements OnModuleInit {
  private id: string;
  private kind: NodeKind;

  constructor(@Inject('ORCHESTRATOR') private client: ClientProxy) {
    this.id = NODE_ID;
    this.kind = process.env.NODE_KIND as NodeKind;
  }

  onModuleInit() {
    this.client.emit('soupware.node.new', { id: this.id, kind: this.kind });
  }

  get() {
    return {
      id: this.id,
      kind: this.kind,
    };
  }
}
