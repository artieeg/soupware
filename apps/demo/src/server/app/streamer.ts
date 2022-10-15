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
