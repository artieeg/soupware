import { SoupwareConsumer } from '@app/types';

export function getConsumerParams(consumer: SoupwareConsumer) {
  return {
    id: consumer.id,
    kind: consumer.kind,
    rtpParameters: consumer.rtpParameters,
    type: consumer.type,
    producerPaused: false,
    producerId: consumer.producerId,
  };
}
