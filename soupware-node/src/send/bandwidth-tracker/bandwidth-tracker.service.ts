import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Producer } from 'mediasoup/node/lib/Producer';

@Injectable()
export class SendBandwidthTrackerService
  implements OnModuleInit, OnModuleDestroy
{
  private tracked: Producer[] = [];
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

  track(producer: Producer) {
    this.tracked.push(producer);
  }

  private async collectBandwidthStats() {
    let newByteCount = 0;

    for (const producer of this.tracked) {
      const stats = await producer.getStats();
      const inboundRtpStats = stats.filter(
        (stat) => stat.type === 'inbound-rtp',
      );

      newByteCount += inboundRtpStats.reduce(
        (acc, stat) => acc + stat.byteCount,
        0,
      );
    }

    this.dByteCount = newByteCount - this.prevByteCount;
    this.prevByteCount = newByteCount;

    console.log('byte count delta', this.dByteCount);
  }
}
