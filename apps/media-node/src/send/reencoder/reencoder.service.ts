import { SoupwareProducer } from '@app/types';
import {
  createPlainReencoderTransport,
  createPlainTransport,
} from '@app/utils';
import { Injectable } from '@nestjs/common';
import { SendRouterService } from '../send-router';
import { getRemoteRTPPort } from '../utils';
import { exec } from 'child_process';
import {
  MediaKind,
  RtpCodecParameters,
} from 'mediasoup/node/lib/RtpParameters';
import { mediaSoupConfig } from '@app/mediasoup.config';

@Injectable()
export class ReencoderService {
  constructor(private sendRouterService: SendRouterService) {}

  async reencode(producer: SoupwareProducer): Promise<SoupwareProducer> {
    const router = this.sendRouterService.getRouter();

    //Port on GStreamer to send to
    const inbound_remoteRtpPort = await getRemoteRTPPort();

    //Port on GStreamer to receive from
    const outbound_remoteRtpPort = await getRemoteRTPPort();

    //Transport to GStreamer
    const outbound_transport = await createPlainTransport(
      router,
      inbound_remoteRtpPort,
    );

    const gstreamerInboundConsumer = await outbound_transport.consume({
      producerId: producer.id,
      rtpCapabilities: router.rtpCapabilities,
      paused: true,
    });

    setTimeout(() => gstreamerInboundConsumer.resume(), 1000);
    setInterval(async () => {
      //console.log(await gstreamerInboundConsumer.getStats());
    }, 1000);

    //Transport from GStreamer
    const inbound_transport = await createPlainReencoderTransport(
      router,
      inbound_remoteRtpPort,
    );

    //Codec info
    const codec = producer.rtpParameters.codecs.find((c) =>
      c.mimeType.includes(producer.kind),
    );

    console.log('CODEC RTPC FEEDBACK', codec.rtcpFeedback);

    const payloadType = codec.payloadType;

    const {
      tuple: { localPort: rtpPort },
      rtcpTuple: { localPort: rtcpPort },
    } = inbound_transport;

    const ssrc = this.generateSynchronizationSource();

    const reencodedProducer: SoupwareProducer =
      (await inbound_transport.produce({
        kind: producer.kind,
        rtpParameters: {
          codecs: [codec],
          encodings: [{ ssrc }],
        },
        appData: producer.appData as any,
      })) as any;

    await this.startGStreamer(
      producer.kind,
      mediaSoupConfig.webRtcTransport.listenIps[0].announcedIp,
      codec,
      {
        port: inbound_remoteRtpPort,
      },
      { ssrc, rtp_port: rtpPort, rtcp_port: rtcpPort },
    );

    reencodedProducer.on('trace', (trace) => {
      console.log(trace);
    });

    return reencodedProducer;
  }

  async startGStreamer(
    kind: MediaKind,
    host: string,
    codec: RtpCodecParameters,
    inbound: { port: number },
    outbound: { ssrc: number; rtp_port: number; rtcp_port: number },
  ) {
    const opts = [
      `rtpbin name=rtpbin udpsrc port=${inbound.port} caps="application/x-rtp,media=${kind},clock-rate=${codec.clockRate},encoding-name=OPUS,payload=${codec.payloadType}"`,
      //'rtpbin.recv_rtp_sink_0 rtpbin.',
      '! rtpopusdepay',
      '! opusdec',
      '! queue',
      //'! audioconvert',
      //'! audioresample',

      // debug: echo back
      //'opusdec',
      //'autoaudiosink',
      //'opusparse',
      //'oggmux',
      //`! pulsesink`,

      //SEND
      '! opusenc',
      `! rtpopuspay pt=${codec.payloadType} ssrc=${outbound.ssrc}`,
      '! rtpbin.send_rtp_sink_0',
      `rtpbin.send_rtp_src_0 ! udpsink host=${host} port=${outbound.rtp_port}`,
      `rtpbin.send_rtcp_src_0 ! udpsink host=${host} port=${outbound.rtcp_port} sync=false async=false`,
    ].join(' ');

    console.log('spawning gst with opts');
    console.log('gst-launch-1.0', opts);

    const gst = exec(`gst-launch-1.0 ${opts}`);

    return gst;
  }

  /**
   * Generate a 8-digit SSRC string
   * */
  private generateSynchronizationSource() {
    return 10000000 + Math.floor(Math.random() * 10000000);
  }
}
