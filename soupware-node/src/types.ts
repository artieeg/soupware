import {
  RtpCapabilities,
  Producer as MediasoupProducer,
  Consumer as MediasoupConsumer,
  MediaKind,
  RtpParameters,
} from 'mediasoup/node/lib/types';
import { SEND_NODE, RECV_NODE } from './constants';

export type NodeKind = typeof SEND_NODE | typeof RECV_NODE;

/** Serializable user */
export interface UserBase {
  id: string;
  rtpCapabilities?: RtpCapabilities;
}

export type AppData = {
  user: UserBase;
  room: string;
};

/** Mediasoup's Producer with strongly typed appData */
export interface SoupwareProducer extends MediasoupProducer {
  appData: AppData;
}

/** Mediasoup's Consumer with strongly typed appData */
export interface SoupwareConsumer extends MediasoupConsumer {
  appData: AppData;
}

/** Params required to consume forwarded streams in recv nodes */
export type PipeConsumerParams = {
  id: string;
  kind: MediaKind;
  rtpParameters: RtpParameters;
  rtpCapabilities: RtpCapabilities;
  appData: AppData;
};
