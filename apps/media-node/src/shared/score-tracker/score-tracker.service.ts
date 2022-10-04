import { SoupwareConsumer, SoupwareProducer } from '@app/types';
import { Injectable } from '@nestjs/common';
import { ConsumerScore } from 'mediasoup/node/lib/Consumer';
import { ProducerScore } from 'mediasoup/node/lib/types';

@Injectable()
export class ScoreTrackerService {
  private consumers: SoupwareConsumer[] = [];
  private producers: SoupwareProducer[] = [];

  private consumerScores: ConsumerScore[] = [];
  private producerScores: ProducerScore[] = [];

  constructor() {}

  async addProducer(producer: SoupwareProducer) {
    this.producers.push(producer);

    producer.on('score', (score) => {
      this.producerScores.push(
        score.reduce((min, p) => (p.score < min.score ? p : min), score[0]),
      );
    });
  }

  async addConsumer(consumer: SoupwareConsumer) {
    this.consumers.push(consumer);

    consumer.on('score', (score) => {
      this.consumerScores.push(score);
    });
  }

  getScoreDistribution() {
    const consumerScores = this.consumerScores.reduce((acc, score) => {
      acc[score.score] = (acc[score.score] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    const producerScores = this.producerScores.reduce((acc, score) => {
      acc[score.score] = (acc[score.score] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    return { consumerScores, producerScores };
  }
}
