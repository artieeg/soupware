import { PipeConsumerParams } from '@app/shared';
import {
  PipeTransport,
  ProducerOptions,
  Transport,
} from 'mediasoup/node/lib/types';
import {
  AppData,
  SoupwarePipeConsumer,
  SoupwarePipeProducer,
  SoupwareSendProducer,
} from './types';

export function createNewProducer(
  transport: Transport,
  options: ProducerOptions & { appData: AppData },
): Promise<SoupwareSendProducer> {
  return transport.produce(options) as Promise<SoupwareSendProducer>;
}

export function createPipeConsumer(
  transport: PipeTransport,
  producer: SoupwareSendProducer,
): Promise<SoupwarePipeConsumer> {
  return transport.consume({
    producerId: producer.id,
    appData: producer.appData,
  }) as Promise<SoupwarePipeConsumer>;
}

export function createPipeProducer(
  transport: PipeTransport,
  params: PipeConsumerParams,
): Promise<SoupwarePipeProducer> {
  return transport.produce({
    id: params.id,
    kind: params.kind,
    rtpParameters: params.rtpParameters,
    appData: params.appData,
  }) as Promise<SoupwarePipeProducer>;
}
