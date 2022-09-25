import { Injectable } from '@nestjs/common';

@Injectable()
export class SendPipeService {
  async pipe(room: string, targetRecvNodeId: string) {}
}
