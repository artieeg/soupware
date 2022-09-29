import { MediaKind, RtpParameters } from "mediasoup/node/lib/types";

export type MediaPermission = {
  recvNodeId?: string;
  sendNodeId?: string;
  user: string;
  room: string;
  produce: {
    audio: boolean;
    video: boolean;
  };
};

export type ProducerParams = {
  id: string;
  kind: MediaKind;
  rtpParameters: RtpParameters;
};
