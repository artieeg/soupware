import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RecordParams } from '@soupware/internals';
import { nanoid } from 'nanoid';
import { firstValueFrom } from 'rxjs';
import { spawn } from 'child_process';
import * as path from 'path';
import { convertStringToReadable, getCommandArgs, getSdpParams } from './utils';

export const RECORDER_ID = nanoid();

@Injectable()
export class RecorderService implements OnModuleInit {
  constructor(@Inject('ORCHESTRATOR') private client: ClientProxy) {}

  async onModuleInit() {
    await firstValueFrom(
      this.client.send('soupware.recorder.new', { recorderId: RECORDER_ID }),
    );
  }

  private spawnRecorder(params: RecordParams) {
    const filename = `${params.room}.${params.user}.${params.kind}.${
      params.kind === 'video' ? 'mp4' : '.aac'
    }`;

    console.log(params);

    const p = path.join('./recordings', filename);
    const process = spawn('ffmpeg', getCommandArgs(p));

    const sdp = convertStringToReadable(
      getSdpParams(params.rtpParameters, params.remoteRtpPort),
    );

    process.stdout.setEncoding('utf8');
    process.stdout.on('data', (str: string) => {
      console.log(str);
    });

    sdp.resume();
    sdp.pipe(process.stdin);
  }

  async spawnRecorders(params: RecordParams[]) {
    await Promise.all(params.map((item) => this.spawnRecorder(item)));
  }
}
