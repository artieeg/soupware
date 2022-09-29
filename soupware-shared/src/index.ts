import { MediaKind, RtpParameters } from "mediasoup/node/lib/types";

export type MediaPermission = {
  user: string;
  room: string;
  produce: {
    audio: boolean;
    video: boolean;
  };
};

export type ConsumerParams = {
  id: string;
  kind: MediaKind;
  rtpParameters: RtpParameters;
  producerId: string;
};
