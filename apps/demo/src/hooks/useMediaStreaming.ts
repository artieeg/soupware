import { useEffect } from "react";
import { useStreamerStore } from "../store";
import { useUserMedia } from "./useUserMedia";

export function useMediaStreaming() {
  const { media } = useUserMedia();

  useEffect(() => {
    const track = media?.getVideoTracks()[0];

    if (track) {
      useStreamerStore.getState().stream(track);
    }
  }, [media]);
}
