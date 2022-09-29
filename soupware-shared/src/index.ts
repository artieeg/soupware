import { MediaKind, RtpParameters } from "mediasoup/node/lib/types";

export type ProducerParams = {
  id: string;
  kind: MediaKind;
  rtpParameters: RtpParameters;
};
