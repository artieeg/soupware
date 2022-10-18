import {
  DtlsParameters,
  IceCandidate,
  IceParameters,
  RtpCapabilities,
  RtpParameters,
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

export type CreateStreamerResponse = {
  transportConnectParams: {
    transportOptions: any;
    routerRtpParameters: RtpParameters;
  };
  mediaPermissionToken: string;
};
