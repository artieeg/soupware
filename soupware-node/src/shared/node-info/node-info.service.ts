import { Injectable } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { NodeKind } from '@app/types';

export const NODE_ID = `${process.env.NODE_KIND}_${nanoid()}`;

@Injectable()
export class NodeInfoService {
  private id: string;
  private kind: NodeKind;

  constructor() {
    this.id = NODE_ID;
    this.kind = process.env.NODE_KIND as NodeKind;
  }

  get() {
    return {
      id: this.id,
      kind: this.kind,
    };
  }
}
