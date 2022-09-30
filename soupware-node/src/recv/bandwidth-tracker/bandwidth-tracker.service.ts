import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Consumer } from 'mediasoup/node/lib/Consumer';

@Injectable()
export class RecvBandwidthTrackerService
  implements OnModuleInit, OnModuleDestroy
{
  private tracked: Consumer[] = [];
  private bandwidthCollectionInterval?: NodeJS.Timer;

  private prevByteCount: number = 0;
  public dByteCount: number = 0;

  onModuleInit() {
    this.bandwidthCollectionInterval = setInterval(() => {
      this.collectBandwidthStats();
    }, 1000);
  }

  onModuleDestroy() {
    clearInterval(this.bandwidthCollectionInterval);
  }

  track(consumer: Consumer) {
    this.tracked.push(consumer);
  }

  private async collectBandwidthStats() {
    let newByteCount = 0;

    for (const consumer of this.tracked) {
      const stats = await consumer.getStats();
      const outboundRtpStats = stats.filter(
        (stat) => stat.type === 'outbound-rtp',
      );

      newByteCount += outboundRtpStats.reduce(
        (acc, stat) => acc + stat.byteCount,
        0,
      );
    }

    this.dByteCount = newByteCount - this.prevByteCount;
    this.prevByteCount = newByteCount;

    console.log('byte count delta', this.dByteCount);
  }
}
