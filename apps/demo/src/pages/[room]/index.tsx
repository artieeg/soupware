import Head from "next/head";
import { useRouter } from "next/router";
import { NextPage } from "next";
import { AppLayout } from "../../layouts";
import {
  useSoupwareClient,
  useStreamerParams,
  useUserMedia,
} from "../../hooks";
import { UserCircle } from "../../components";
import { useEffect, useRef } from "react";
import { useRoomId } from "../../hooks/useRoomId";

const useMediaStreaming = () => {
  const router = useRouter();
  const room = router.query.room as string;

  const { media } = useUserMedia();
  const client = useSoupwareClient();
  const streamerParams = useStreamerParams(room);

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

const Room: NextPage = () => {
  const room = useRoomId();
  const { media } = useUserMedia();

  useMediaStreaming();

  return (
    <>
      <Head>
        <title>soupdemo {room}</title>
        <meta name="description" content={`Soupdemo Room ${room}`} />
      </Head>

      <AppLayout>
        <div>
          <UserCircle media={media} />
        </div>
      </AppLayout>
    </>
  );
};

export default Room;
