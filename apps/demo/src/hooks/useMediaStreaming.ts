import { useRef, useEffect } from "react";
import { useRoomId } from "./useRoomId";
import { useSoupwareClient } from "./useSoupwareClient";
import { useStreamerParams } from "./useStreamerParams";
import { useUserMedia } from "./useUserMedia";

export const useMediaStreaming = () => {
  const room = useRoomId();

  const { media } = useUserMedia();
  const streamerParams = useStreamerParams(room);
  const client = useSoupwareClient("send");

  const isStreaming = useRef(false);

  const stream = async () => {
    if (!client || !streamerParams || !media || isStreaming.current) return;

    const {
      transportConnectParams: { routerRtpParameters, transportOptions },
    } = streamerParams;

    const transport = await client.createSendTransport(
      routerRtpParameters,
      transportOptions
    );

    await client.produce({
      track: media.getVideoTracks().at(0)!,
      transport,
    });

    isStreaming.current = true;
  };

  useEffect(() => {
    stream();
  }, [media, streamerParams]);
};
