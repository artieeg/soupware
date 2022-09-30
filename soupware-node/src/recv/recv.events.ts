import EventEmitter from 'events';
import { StrictEventEmitter } from 'nest-emitter';
import { ConsumerEvents } from './consumer';

export interface RecvEvents extends ConsumerEvents {}

export type RecvEventEmitter = StrictEventEmitter<EventEmitter, RecvEvents>;
