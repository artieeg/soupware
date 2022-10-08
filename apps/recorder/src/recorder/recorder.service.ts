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
import { InjectEventEmitter } from 'nest-emitter';
import { RecorderEventEmitter } from 'src/types';

export const RECORDER_ID = nanoid();

@Injectable()
export class RecorderService implements OnModuleInit, OnApplicationShutdown {
  private recorders: Map<string, RoomRecorders>;
  constructor(
    @Inject('ORCHESTRATOR') private client: ClientProxy,
    @InjectEventEmitter() private emitter: RecorderEventEmitter,
  ) {
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
          Object.values(item.processes).map((recorder) => {
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
      //Log ffmpeg messages here
      console.log(str);
    });

    sdp.resume();
    sdp.pipe(ffmpeg.stdin);

    const room = this.getOrCreateRoom(params.room);
    room.files.push(p);
    const processes = this.getOrCreateProcesses(params.room, params.user);
    processes[params.kind] = ffmpeg;
  }

  private getOrCreateProcesses(room: string, user: string) {
    const roomRecorders = this.getOrCreateRoom(room);
    let processes = roomRecorders.processes.get(user);
    if (!processes) {
      processes = {
        audio: null,
        video: null,
      };
      roomRecorders.processes.set(user, processes);
    }

    return processes;
  }

  private getOrCreateRoom(room_id: string) {
    let room = this.recorders.get(room_id);

    if (!room) {
      room = {
        processes: new Map(),
        files: [],
      };

      this.recorders.set(room_id, room);
    }

    return room;
  }

  async spawnRecorders(params: RecordParams[]) {
    await Promise.all(params.map((item) => this.spawnRecorder(item)));
  }

  async stopRecordersForUser(room: string, user: string) {
    const recorders = this.recorders.get(room)?.processes.get(user);
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

    this.recorders.get(room).processes.delete(user);

    return { status: 'ok' };
  }

  async stopRecordersForRoom(room: string) {
    const recorders = this.recorders.get(room);
    if (!recorders) return;

    //Close audio and video producers
    await Promise.all(
      Array.from(recorders.processes.values()).map((item) => {
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

    this.emitter.emit('recording:ready', {
      files: recorders.files,
      room,
    });

    return { status: 'ok' };
  }
}
