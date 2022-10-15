import { Device } from "mediasoup-client";
import { RtpCapabilities } from "mediasoup-client/lib/RtpParameters";
import { DtlsParameters, Transport } from "mediasoup-client/lib/Transport";

type Signalers = {
  streamer: {
    connect: (params: {
      dtlsParameters: DtlsParameters;
      mediaPermissionToken: string;
      rtpCapabilities: RtpCapabilities;
    }) => Promise<void>;
    produce: (params: {
      producerOptions: any;
      mediaPermissionToken: string;
    }) => Promise<{ id: string }>;
  };
};

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

    setInterval(async () => {
      console.log(await producer.getStats());
    }, 1000);
  }

  async createSendTransport(
    routerRtpParameters: RtpCapabilities,
    transportOptions: any
  ) {
    await this.sendDevice.load({ routerRtpCapabilities: routerRtpParameters });
    const transport = this.sendDevice.createSendTransport(transportOptions);

    transport.on("connect", async ({ dtlsParameters }, callback, errback) => {
      try {
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
    transportOptions: any,
    signal: (params: {
      dtls: DtlsParameters;
      mediaPermissionToken: string;
    }) => Promise<void>
  ) {
    await this.recvDevice.load({ routerRtpCapabilities: routerRtpParameters });
    const transport = this.recvDevice.createRecvTransport(transportOptions);

    return new Promise<Transport>(async (resolve, reject) => {
      transport.on("connect", async ({ dtlsParameters }, callback, errback) => {
        try {
          await signal({
            dtls: dtlsParameters,
            mediaPermissionToken: this.mediaPermissionToken,
          });
          callback();
          resolve(transport);
        } catch (error) {
          errback(error);
          reject();
        }
      });
    });
  }
}
