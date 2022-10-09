import {
  RtpCodecCapability,
  TransportListenIp,
} from 'mediasoup/node/lib/types';

export const mediaSoupConfig = {
  mediasoup: {
    worker: {
      rtcMinPort: 40000,
      rtcMaxPort: 49999,
    },
    mediaCodecs: [
      {
        kind: 'audio',
        mimeType: 'audio/opus',
        clockRate: 48000,
        channels: 2,
      },
      {
        kind: 'video',
        mimeType: 'video/H264',
        clockRate: 90000,
        preferredPayloadType: 101,
        rtcpFeedback: [
          { type: 'nack' },
          { type: 'nack', parameter: 'pli' },
          { type: 'ccm', parameter: 'fir' },
          { type: 'goog-remb' },
        ],
        parameters: {
          'level-asymmetry-allowed': 1,
          'packetization-mode': 1,
          'profile-level-id': '4d0032',
        },
      },
      {
        kind: 'video',
        mimeType: 'video/vp8',
        clockRate: 90000,
        parameters: {
          'x-google-start-bitrate': 1000,
        },
      },
    ] as RtpCodecCapability[],
  },

  webRtcTransport: {
    listenIps: [
      {
        ip: process.env.MEDIASOUP_IP,
        announcedIp: process.env.MEDIASOUP_ANNOUNCED_IP,
      },
    ] as TransportListenIp[],
    initialAvailableOutgoingBitrate: 800000,
  },

  recorderPlainTransport: {
    listenIp: {
      ip: process.env.MEDIASOUP_IP,
      announcedIp: process.env.MEDIASOUP_IP,
    },
    rtcpMux: true,
    comedia: false,
  },

  reencoderPlainTransport: {
    listenIp: {
      ip: process.env.MEDIASOUP_IP,
      announcedIp: process.env.MEDIASOUP_IP,
    },
    rtcpMux: false,
    comedia: true,
  },
} as const;
