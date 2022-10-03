import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MediaNodeLoad } from '@soupware/internals';
import * as os from 'os-utils';
import { BandwidthTrackerService } from '../bandwidth-tracker';
import { NODE_ID } from '../node-info';
import { ScoreTrackerService } from '../score-tracker';

@Injectable()
export class LoadReporterService implements OnModuleInit, OnModuleDestroy {
  private loadCollectionInterval?: NodeJS.Timer;

  constructor(
    private scoreTrackerService: ScoreTrackerService,
    private bandwidthTrackerService: BandwidthTrackerService,
    @Inject('ORCHESTRATOR') private client: ClientProxy,
  ) {}

  onModuleInit() {
    this.loadCollectionInterval = setInterval(() => {
      this.sendLoadStats();
    }, 1000);
  }

  onModuleDestroy() {
    clearInterval(this.loadCollectionInterval);
  }

  private sendLoadStats() {
    os.cpuUsage(async (p) => {
      const bandwidth =
        await this.bandwidthTrackerService.collectBandwidthUsage();

      const { consumerScores, producerScores } =
        this.scoreTrackerService.getScoreDistribution();

      this.client.emit('soupware.node.load', {
        id: NODE_ID,
        kind: process.env.NODE_KIND,
        bandwidth,
        cpu: p,
        scores: {
          consumers: consumerScores,
          producers: producerScores,
        },
      } as MediaNodeLoad);
    });
  }
}
