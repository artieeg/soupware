import {
  PipeTransport,
  ProducerOptions,
  Router,
  RtpCapabilities,
  Transport,
} from 'mediasoup/node/lib/types';
import { mediaSoupConfig } from './mediasoup.config';
import {
  AppData,
  PipeConsumerParams,
  SoupwareConsumer,
  SoupwarePlainTransport,
  SoupwareProducer,
  SoupwareRouterProducer,
} from './types';

export function createNewProducer(
  transport: Transport,
  options: ProducerOptions & { appData: AppData },
): Promise<SoupwareProducer> {
  return transport.produce(options) as Promise<SoupwareProducer>;
}

export function createNewConsumer(
  transport: Transport,
  options: {
    rtpCapabilities: RtpCapabilities;
    producerId: string;
    appData: AppData;
  },
): Promise<SoupwareConsumer> {
  return transport.consume({
    ...options,
    paused: false,
  }) as Promise<SoupwareConsumer>;
}

export function createPipeConsumer(
  transport: PipeTransport,
  producer: SoupwareProducer,
): Promise<SoupwareConsumer> {
  return transport.consume({
    producerId: producer.id,
    appData: producer.appData,
  }) as Promise<SoupwareConsumer>;
}

export function createPipeProducer(
  transport: PipeTransport,
  params: PipeConsumerParams,
): Promise<SoupwareProducer> {
  return transport.produce({
    id: params.id,
    kind: params.kind,
    rtpParameters: params.rtpParameters,
    appData: params.appData,
  }) as Promise<SoupwareProducer>;
}

export async function pipeProducerToRouter({
  sourceRouter,
  targetRouter,
  producer,
}: {
  sourceRouter: Router;
  targetRouter: Router;
  producer: SoupwareProducer;
}) {
  const r = await sourceRouter.pipeToRouter({
    producerId: producer.id,
    router: targetRouter,
  });

  //r.pipeProducer!.appData = producer.appData;

  return r.pipeProducer as SoupwareRouterProducer;
}

export async function createPlainTransport(router: Router) {
  return router.createPlainTransport(
    mediaSoupConfig.plainTransport,
  ) as Promise<SoupwarePlainTransport>;
}
