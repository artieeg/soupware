import { ProducerOptions, Transport } from 'mediasoup/node/lib/types';
import { AppData, SoupwareSendProducer } from './types';

export function createNewProducer(
  transport: Transport,
  options: ProducerOptions & { appData: AppData },
): Promise<SoupwareSendProducer> {
  return transport.produce(options) as Promise<SoupwareSendProducer>;
}
