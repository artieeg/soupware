import { Injectable } from '@nestjs/common';
import { ProducerOptions } from 'mediasoup/node/lib/Producer';
import { UserService } from '../user';

@Injectable()
export class ProducerService {
  constructor(private userService: UserService) {}

  async create(user_id: string, options: ProducerOptions) {
    const user = this.userService.get(user_id);

    const producer = await user.transport.produce(options);

    return { id: producer.id };
  }
}
