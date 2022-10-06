import { ChildProcess } from 'child_process';

export type RoomRecorders = Map<
  string,
  {
    audio?: ChildProcess;
    video?: ChildProcess;
  }
>;
