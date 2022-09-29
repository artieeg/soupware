import { MediaKind, RtpParameters } from "mediasoup/node/lib/types";

export type ConsumerParams = {
  id: string;
  kind: MediaKind;
  rtpParameters: RtpParameters;
  producerId: string;
};
