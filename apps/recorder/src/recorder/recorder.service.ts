import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RecordParams } from '@soupware/internals';
import { nanoid } from 'nanoid';
import { firstValueFrom } from 'rxjs';

const RECORDER_ID = nanoid();

@Injectable()
export class RecorderService implements OnModuleInit {
  constructor(@Inject('ORCHESTRATOR') private client: ClientProxy) {}

  async onModuleInit() {
    await firstValueFrom(
      this.client.send('soupware.recorder.new', { recorderId: RECORDER_ID }),
    );
  }

  private spawnRecorder(param: RecordParams) {}

  async spawnRecorders(params: RecordParams[]) {
    await Promise.all(params.map(this.spawnRecorder));
  }
}
