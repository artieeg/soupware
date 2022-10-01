import EventEmitter from 'events';
import { StrictEventEmitter } from 'nest-emitter';
import { TrackEvents } from './track';

export interface RecvEvents extends TrackEvents {}

export type RecvEventEmitter = StrictEventEmitter<EventEmitter, RecvEvents>;
