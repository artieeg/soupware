import { ProducerOptions, Transport } from 'mediasoup/node/lib/types';
import { AppData, Producer } from '@app/types';

export function createNewProducer(
  transport: Transport,
  options: ProducerOptions & { appData: AppData },
): Promise<Producer> {
  return transport.produce(options) as Promise<Producer>;
}
