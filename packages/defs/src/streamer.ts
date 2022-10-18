import { RtpCapabilities, TransportOptions } from "mediasoup-client/lib/types";

export type TransportConnectParams = {
  transportOptions: TransportOptions;
  routerRtpParameters: RtpCapabilities;
};

export type StreamerParams = {
  transportConnectParams: TransportConnectParams;
  mediaPermissionToken: string;
};
