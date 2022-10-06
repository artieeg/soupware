import {
  Inject,
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RecordParams } from '@soupware/internals';
import { nanoid } from 'nanoid';
import { firstValueFrom } from 'rxjs';
import { spawn } from 'child_process';
import * as path from 'path';
import { convertStringToReadable, getCommandArgs, getSdpParams } from './utils';
import { RoomRecorders } from './recorder.types';

export const RECORDER_ID = nanoid();

@Injectable()
export class RecorderService implements OnModuleInit, OnApplicationShutdown {
  private recorders: Map<string, RoomRecorders>;
  constructor(@Inject('ORCHESTRATOR') private client: ClientProxy) {
    this.recorders = new Map();
  }

  async onModuleInit() {
    await firstValueFrom(
      this.client.send('soupware.recorder.new', { recorderId: RECORDER_ID }),
    );
  }

  async onApplicationShutdown() {
    await firstValueFrom(
      this.client.send('soupware.recorder.delete', { recorderId: RECORDER_ID }),
    );

    //Kill FFMPEG processes
    await Promise.all(
      Array.from(this.recorders.values()).map((item) => {
        return Promise.all(
          Object.values(item).map((recorder) => {
            return new Promise((resolve) => {
              recorder.on('close', resolve);
              recorder.kill();
            });
          }),
        );
      }),
    );
  }

  private spawnRecorder(params: RecordParams) {
    const filename = `${params.room}.${params.user}.${params.kind}.${
      params.kind === 'video' ? 'mp4' : 'aac'
    }`;

    const p = path.join('./recordings', filename);
    const ffmpeg = spawn('ffmpeg', getCommandArgs(p, params.kind));

    const sdp = convertStringToReadable(
      getSdpParams(params.kind, params.rtpParameters, params.remoteRtpPort),
    );

    ffmpeg.stderr.setEncoding('utf-8');
    ffmpeg.stderr.on('data', (str: string) => {
      console.log(str);
    });

    sdp.resume();
    sdp.pipe(ffmpeg.stdin);
  }

  async spawnRecorders(params: RecordParams[]) {
    await Promise.all(params.map((item) => this.spawnRecorder(item)));
  }

  async stopRecordersForUser(room: string, user: string) {
    const recorders = this.recorders.get(room)?.get(user);
    if (!recorders) return;

    //Close audio and video producers
    await Promise.all(
      Object.values(recorders).map((recorder) => {
        return new Promise((resolve) => {
          recorder.on('close', resolve);
          recorder.kill();
        });
      }),
    );

    this.recorders.get(room).delete(user);
  }

  async stopRecordersForRoom(room: string) {
    const recorders = this.recorders.get(room);
    if (!recorders) return;

    //Close audio and video producers
    await Promise.all(
      Array.from(recorders.values()).map((item) => {
        return Promise.all(
          Object.values(item).map((recorder) => {
            return new Promise((resolve) => {
              recorder.on('close', resolve);
              recorder.kill();
            });
          }),
        );
      }),
    );

    this.recorders.delete(room);
  }
}
