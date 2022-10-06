import { MediaKind, RtpParameters } from 'mediasoup/node/lib/types';
import { Readable } from 'stream';

function getCodecInfoFromRtpParameters(
  kind: MediaKind,
  rtpParameters: RtpParameters,
) {
  return {
    payloadType: rtpParameters.codecs[0].payloadType,
    codecName: rtpParameters.codecs[0].mimeType.replace(`${kind}/`, ''),
    clockRate: rtpParameters.codecs[0].clockRate,
    channels: kind === 'audio' ? rtpParameters.codecs[0].channels : undefined,
  };
}

export function getSdpParams(
  rtpParameters: RtpParameters,
  remoteRtpPort: number,
) {
  const videoCodecInfo = getCodecInfoFromRtpParameters('video', rtpParameters);

  return `v=0
  o=- 0 0 IN IP4 127.0.0.1
  s=FFmpeg
  c=IN IP4 127.0.0.1
  t=0 0
  m=video ${remoteRtpPort} RTP/AVP ${videoCodecInfo.payloadType} 
  a=rtpmap:${videoCodecInfo.payloadType} ${videoCodecInfo.codecName}/${videoCodecInfo.clockRate}
  a=sendonly
  `;
}

export function convertStringToReadable(stringToConvert: any) {
  const stream = new Readable();
  stream._read = () => {};
  stream.push(stringToConvert);
  stream.push(null);

  return stream;
}

export function getCommandArgs(path: string) {
  let commandArgs = [
    '-loglevel',
    'debug',
    '-protocol_whitelist',
    'pipe,udp,rtp',
    '-fflags',
    '+genpts',
    '-f',
    'sdp',
    '-i',
    'pipe:0',
  ];

  commandArgs = commandArgs.concat(['-flags', '+global_header', `${path}`]);

  return commandArgs;
}
