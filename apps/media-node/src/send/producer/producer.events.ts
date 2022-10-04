import { SoupwareProducer } from '@app/types';

export interface ProducerEvents {
  'new-producer': { producer: SoupwareProducer; room: string; user: string };
}
