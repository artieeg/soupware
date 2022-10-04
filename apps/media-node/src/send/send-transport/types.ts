import { RtpCapabilities } from 'mediasoup/node/lib/RtpParameters';
import {
  DtlsParameters,
  IceCandidate,
  IceParameters,
} from 'mediasoup/node/lib/WebRtcTransport';

export type TransportOptions = {
  id: string;
  iceParameters: IceParameters;
  iceCandidates: IceCandidate[];
  dtlsParameters: DtlsParameters;
};

export type ConnectTransportOptions = {
  transportOptions: TransportOptions;
  routerRtpParameters: RtpCapabilities;
};
