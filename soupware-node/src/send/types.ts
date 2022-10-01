import {
  Producer as MediasoupProducer,
  Consumer as MediasoupConsumer,
} from 'mediasoup/node/lib/types';
import { UserBase } from './room/types';

export type AppData = {
  user: UserBase;
  room: string;
};

/** Mediasoup's Producer with strongly typed appData */
export interface SoupwareSendProducer extends MediasoupProducer {
  appData: AppData;
}

export interface SoupwarePipeConsumer extends MediasoupConsumer {
  appData: AppData;
}

export interface SoupwarePipeProducer extends MediasoupProducer {
  appData: AppData;
}
