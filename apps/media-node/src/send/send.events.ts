import EventEmitter from 'events';
import { StrictEventEmitter } from 'nest-emitter';
import { PipeEvents } from './pipe';
import { ProducerEvents } from './producer/producer.events';

export interface SendEvents extends ProducerEvents, PipeEvents {}

export type SendEventEmitter = StrictEventEmitter<EventEmitter, SendEvents>;
