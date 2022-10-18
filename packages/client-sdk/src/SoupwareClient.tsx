import { Device } from "mediasoup-client";
import { RtpCapabilities } from "mediasoup-client/lib/RtpParameters";
import { Transport } from "mediasoup-client/lib/Transport";
import { Signalers } from "./types";

export class SoupwareClient {
  private recvDevice: Device;
  private sendDevice: Device;

  constructor(
    private mediaPermissionToken: string,
    private signalers: Signalers
  ) {
    this.recvDevice = new Device();
    this.sendDevice = new Device();
  }

  get recvRtpCapabilities() {
    return this.recvDevice.rtpCapabilities;
  }

  async produce({
    transport,
    track,
  }: {
    track: MediaStreamTrack;
    transport: Transport;
  }) {
    transport.once("produce", (producerOptions, callback, errback) => {
      this.signalers.streamer
        .produce({
          producerOptions,
          mediaPermissionToken: this.mediaPermissionToken,
        })
        .then((id) => callback(id))
        .catch(errback);
    });

    const producer = await transport.produce({ track });

    return producer;
  }

  async createSendTransport(
    routerRtpParameters: RtpCapabilities,
    transportOptions: any
  ) {
    await this.sendDevice.load({ routerRtpCapabilities: routerRtpParameters });
    const transport = this.sendDevice.createSendTransport(transportOptions);

    transport.on("connect", async ({ dtlsParameters }, callback, errback) => {
      try {
        console.log({
          dtlsParameters,
          mediaPermissionToken: this.mediaPermissionToken,
          rtpCapabilities: this.sendDevice.rtpCapabilities,
        });
        await this.signalers.streamer.connect({
          dtlsParameters,
          mediaPermissionToken: this.mediaPermissionToken,
          rtpCapabilities: this.sendDevice.rtpCapabilities,
        });
        callback();
      } catch (e: any) {
        console.log(e);
        errback(e);
      }
    });

    return transport;
  }

  async createRecvTransport(
    routerRtpParameters: RtpCapabilities,
    transportOptions: any
  ) {
    await this.recvDevice.load({ routerRtpCapabilities: routerRtpParameters });
    const transport = this.recvDevice.createRecvTransport(transportOptions);

    transport.on("connect", async ({ dtlsParameters }, callback, errback) => {
      try {
        await this.signalers.consumer.connect({
          dtlsParameters,
          mediaPermissionToken: this.mediaPermissionToken,
        });
        callback();
      } catch (error: any) {
        errback(error);
      }
    });

    return transport;
  }
}
