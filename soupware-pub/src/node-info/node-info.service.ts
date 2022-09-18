import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { nanoid } from 'nanoid';
import { NodeKind } from '../types';

@Injectable()
export class NodeInfoService {
  private id: string;
  private kind: string;

  constructor(private config: ConfigService) {
    const kind = this.config.get('NODE_KIND') as NodeKind;

    this.kind = kind;
    this.id = `${kind}_${nanoid()}`;
  }

  get() {
    return {
      id: this.id,
      kind: this.kind,
    };
  }
}
