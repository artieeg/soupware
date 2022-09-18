import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class StreamerService implements OnApplicationBootstrap {
  constructor(@Inject('MEDIA_NODE') private client: ClientProxy) {}

  async onApplicationBootstrap() {
    await this.client.connect();
  }

  async create(streamer: string) {
    console.log('creating');
    const response = await firstValueFrom(
      this.client.send('soupware.transport.create', { user: streamer }),
    );

    console.log(response);

    return response;
  }
}
