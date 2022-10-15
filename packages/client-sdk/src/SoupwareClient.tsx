import { Device } from "mediasoup-client";
import {
  RtpCapabilities,
  RtpParameters,
} from "mediasoup-client/lib/RtpParameters";

export class SoupwareClient {
  private recvDevice: Device;
  private sendDevice: Device;

  constructor() {
    this.recvDevice = new Device();
    this.sendDevice = new Device();
  }

  async createRecvTransport(
    routerRtpParameters: RtpCapabilities,
    transportOptions: any,
    signal: (dtls: any, mediaPermissionToken: string) => Promise<void>
  ) {
    await this.recvDevice.load({ routerRtpCapabilities: routerRtpParameters });
    const transport = this.recvDevice.createRecvTransport(transportOptions);

    return new Promise<void>(async (resolve, reject) => {
      transport.on("connect", async ({ dtlsParameters }, callback, errback) => {
        try {
          await signal(
            dtlsParameters,
            transportOptions.appData.mediaPermissionToken
          );
          callback();
          resolve();
        } catch (error) {
          errback(error);
          reject();
        }
      });
    });
  }
}
