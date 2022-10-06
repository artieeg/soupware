import {
  SoupwareProducer,
  SoupwareConsumer,
  SoupwareRouterProducer,
} from '@app/types';
import { Transport, Router, RtpCapabilities } from 'mediasoup/node/lib/types';

export type Room = {
  id: string;
  producers: Map<
    string,
    {
      audio?: RoomProducer;
      video?: RoomProducer;
    }
  >;
  users: User[];
};

export type RoomProducer = {
  router_producers: RouterProducers;
  pipe_producer: SoupwareRouterProducer;
};

/**
 * Producer.
 * key -- egress router id
 * value -- producer on that router
 * */
export type RouterProducers = Map<string, SoupwareProducer>;

export type User = {
  id: string;
  router: Router;
  transport: Transport;
  consumers: SoupwareConsumer[];
  rtpCapabilities: RtpCapabilities;
};
