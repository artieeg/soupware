import { Controller, Post } from '@nestjs/common';
import { ApiTokenService } from './api-token.service';

@Controller()
export class ApiTokenController {
  constructor(private apiTokenService: ApiTokenService) {}

  @Post('/token')
  async onCreateToken() {
    const token = await this.apiTokenService.create();

    return { token };
  }
}
