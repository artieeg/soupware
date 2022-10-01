import { Producer as MediasoupProducer } from 'mediasoup/node/lib/types';
import { UserBase } from './room/types';

export type AppData = {
  user: UserBase;
  room: string;
};

/** Mediasoup's Producer with strongly typed appData */
export interface SoupwareSendProducer extends MediasoupProducer {
  appData: AppData;
}
