import { ChildProcess } from 'child_process';

export type ProcessMap = Map<
  string,
  {
    audio?: ChildProcess;
    video?: ChildProcess;
  }
>;

export type RoomRecorders = {
  files: string[];
  processes: ProcessMap;
};
