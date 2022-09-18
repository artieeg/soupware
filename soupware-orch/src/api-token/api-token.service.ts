import { Injectable } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { ApiTokenStore } from './api-token.store';

@Injectable()
export class ApiTokenService {
  constructor(private apiTokenStore: ApiTokenStore) {}

  async create() {
    const token = `soupware_${nanoid(16)}`;
    await this.apiTokenStore.save(token);

    return token;
  }
}
