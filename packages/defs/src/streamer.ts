import {
  DtlsParameters,
  IceCandidate,
  IceParameters,
  RtpCapabilities,
} from "mediasoup-client/lib/types";

export type TransportOptions = {
  id: string;
  iceParameters: IceParameters;
  iceCandidates: IceCandidate[];
  dtlsParameters: DtlsParameters;
};

export type TransportConnectParams = {
  transportOptions: TransportOptions;
  routerRtpParameters: RtpCapabilities;
};

export type StreamerParams = {
  transportConnectParams: {
    transportOptions: any;
    routerRtpParameters: RtpCapabilities;
  };
  mediaPermissionToken: string;
};
