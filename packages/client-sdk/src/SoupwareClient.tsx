import { Device } from "mediasoup-client";
import { RtpCapabilities } from "mediasoup-client/lib/RtpParameters";
import { DtlsParameters, Transport } from "mediasoup-client/lib/Transport";

export class SoupwareClient {
  private recvDevice: Device;
  private sendDevice: Device;

  constructor(private mediaPermissionToken: string) {
    this.recvDevice = new Device();
    this.sendDevice = new Device();
  }

  async createSendTransport(
    routerRtpParameters: RtpCapabilities,
    transportOptions: any,
    signal: (params: {
      dtls: DtlsParameters;
      mediaPermissionToken: string;
      rtpCapabilities: RtpCapabilities;
    }) => Promise<string>
  ) {
    await this.recvDevice.load({ routerRtpCapabilities: routerRtpParameters });
    const transport = this.recvDevice.createSendTransport(transportOptions);

    return new Promise<Transport>(async (resolve, reject) => {
      transport.on("connect", async ({ dtlsParameters }, callback, errback) => {
        try {
          await signal({
            dtls: dtlsParameters,
            mediaPermissionToken: this.mediaPermissionToken,
            rtpCapabilities: this.sendDevice.rtpCapabilities,
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
