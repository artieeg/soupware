import {
  MediaKind,
  RtpCapabilities,
  RtpParameters,
} from "mediasoup/node/lib/types";

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

export interface MediaNodeLoad {
  id: string;
  kind: string;

  /** CPU usage (0 - 1) */
  cpu: number;

  /** Node max bandwidth */
  max_bandwidth: number;

  /** Bandwidth usage in bytes */
  bandwidth: {
    inbound: number;
    outbound: number;
  };

  /** RTP Stream Score Distribution */
  scores: {
    consumers: Record<number, number>;
    producers: Record<number, number>;
  };
}

export type RecordParams = {
  remoteRtpPort: number;
  localRtcpPort?: number;
  rtpCapabilities: RtpCapabilities;
  rtpParameters: RtpParameters;
  room: string;
  user: string;
  kind: MediaKind;
};

export type RequestRoomRecording = {
  params: RecordParams[];
};

export type AudioLevel = {
  room: string;
  user: string;
  volume: number;
};

export type AudioLevelEvent = AudioLevel[];
