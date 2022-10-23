import {
  MediaKind,
  RtpCapabilities,
  RtpParameters,
  TransportOptions,
} from "mediasoup-client/lib/types";

export type TransportConnectParams = {
  transportOptions: TransportOptions;
  routerRtpParameters: RtpCapabilities;
};

export type ConsumerParams = {
  id: string;
  kind: MediaKind;
  rtpParameters: RtpParameters;
  type: "simple" | "simulcast" | "svc" | "pipe";
  producerId: string;
};

export type UserParams = {
  transportConnectParams: TransportConnectParams;
  mediaPermissionToken: string;
};
