import { MediaKind, RtpParameters } from 'mediasoup/node/lib/types';
import { Readable } from 'stream';

function getCodecDetails(kind: MediaKind, rtpParameters: RtpParameters) {
  return {
    payloadType: rtpParameters.codecs[0].payloadType,
    codecName: rtpParameters.codecs[0].mimeType.replace(`${kind}/`, ''),
    clockRate: rtpParameters.codecs[0].clockRate,
    channels: kind === 'audio' ? rtpParameters.codecs[0].channels : undefined,
  };
}

export function getSdpParams(
  kind: MediaKind,
  rtpParameters: RtpParameters,
  remoteRtpPort: number,
) {
  const codec = getCodecDetails(kind, rtpParameters);
  console.log(codec);

  return `v=0
  o=- 0 0 IN IP4 127.0.0.1
  s=FFmpeg
  c=IN IP4 127.0.0.1
  t=0 0
  m=${kind} ${remoteRtpPort} RTP/AVP ${codec.payloadType} 
  a=rtpmap:${codec.payloadType} ${codec.codecName}/${codec.clockRate}
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

export function getCommandArgs(path: string, kind: MediaKind) {
  let commandArgs = [
    '-y',
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

  if (kind === 'audio') {
    //commandArgs = commandArgs.concat(['-map', '0:a:0', '-c:a', 'copy']);
  }

  if (kind === 'video') {
    //commandArgs = commandArgs.concat(['-map', '0:v:0', '-c:v', 'copy']);
    //commandArgs = commandArgs.concat(['-map', '0:v:0', '-c:v', 'libvpx']);
  }

  commandArgs = commandArgs.concat(['-flags', '+global_header', `${path}`]);

  return commandArgs;
}
