import { StrictEventEmitter } from 'nest-emitter';
import EventEmitter from 'events';

export interface RecorderEvents {
  'recording:ready': {
    room: string;
    files: string[];
  };
}

export type RecorderEventEmitter = StrictEventEmitter<
  EventEmitter,
  RecorderEvents
>;
