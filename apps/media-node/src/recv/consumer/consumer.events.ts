import { SoupwareConsumer } from '@app/types';

export interface ConsumerEvents {
  'new-consumer': {
    consumer: SoupwareConsumer;
    room: string;
    user: string;
  };
}
