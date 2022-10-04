import {
  Inject,
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { nanoid } from 'nanoid';
import { NodeKind } from '@app/types';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

export const NODE_ID = `${process.env.NODE_KIND}_${nanoid()}`;
export const NODE_BANDWIDTH = Number.parseInt(
  process.env.SOUPWARE_BANDWIDTH_BPS,
);

@Injectable()
export class NodeInfoService implements OnModuleInit, OnApplicationShutdown {
  private id: string;
  private kind: NodeKind;

  constructor(@Inject('ORCHESTRATOR') private client: ClientProxy) {
    this.id = NODE_ID;
    this.kind = process.env.NODE_KIND as NodeKind;
  }

  async onApplicationShutdown() {
    await firstValueFrom(
      this.client.send('soupware.node.del', { id: this.id, kind: this.kind }),
    );
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
