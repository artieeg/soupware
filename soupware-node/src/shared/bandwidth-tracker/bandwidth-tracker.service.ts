import { Injectable } from '@nestjs/common';
import { Consumer, Producer } from 'mediasoup/node/lib/types';

@Injectable()
export class BandwidthTrackerService {
  private tracked: (Producer | Consumer)[] = [];

  private prevOutboundByteCount: number = 0;
  public dOutboundByteCount: number = 0;

  private prevInboundByteCount: number = 0;
  public dInboundByteCount: number = 0;

  track(producer: Producer | Consumer) {
    this.tracked.push(producer);
  }

  async collectBandwidthUsage() {
    let newInboudByteCount = 0;
    let newOutboudByteCount = 0;

    for (const item of this.tracked) {
      try {
        const stats = await item.getStats();
        const inboundRtpStats = stats.filter(
          (stat) => stat.type === 'inbound-rtp',
        );

        const outboundRtpStats = stats.filter(
          (stat) => stat.type === 'outbound-rtp',
        );

        newOutboudByteCount += outboundRtpStats.reduce(
          (acc, stat) => acc + stat.byteCount,
          0,
        );

        newInboudByteCount += inboundRtpStats.reduce(
          (acc, stat) => acc + stat.byteCount,
          0,
        );
      } catch (e) {}
    }

    this.dOutboundByteCount = newOutboudByteCount - this.prevOutboundByteCount;
    this.prevOutboundByteCount = newOutboudByteCount;

    this.dInboundByteCount = newInboudByteCount - this.prevInboundByteCount;
    this.prevInboundByteCount = newInboudByteCount;

    if (process.env.NODE_KIND === 'RECV') {
      console.log('dBytes', this.dOutboundByteCount);
    }

    return {
      inbound: this.dInboundByteCount,
      outbound: this.dOutboundByteCount,
    };
  }
}
