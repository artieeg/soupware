import { soupware } from "./soupware";

export function createStreamer(room: string, user: string) {
  return soupware.streamer.create({
    user,
    room,
    permissions: {
      audio: true,
      video: true,
    },
  });
}

export function connectStreamer(params: {
  mediaPermissionToken: string;
  dtlsParameters: any;
  rtpCapabilities: any;
}) {
  return soupware.streamer.connect(params);
}
