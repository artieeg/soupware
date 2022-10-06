import { SoupwareConsumer } from '@app/types';
import { ConsumerParams } from '@soupware/internals';

export function getConsumerParams(consumer: SoupwareConsumer): ConsumerParams {
  return {
    id: consumer.id,
    kind: consumer.kind,
    rtpParameters: consumer.rtpParameters,
    type: consumer.type,
    producerId: consumer.producerId,
  };
}
