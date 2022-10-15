import Head from "next/head";
import { useRouter } from "next/router";
import { NextPage } from "next";
import { AppLayout } from "../../layouts";
import { useStreamerParams, useUserMedia } from "../../hooks";
import { UserCircle } from "../../components";
import { useEffect } from "react";
import { stream } from "../../app";

const Room: NextPage = () => {
  const router = useRouter();
  const room = router.query.room as string;

  const streamerParams = useStreamerParams(room);
  const { media } = useUserMedia();

  useEffect(() => {
    if (streamerParams && media) {
      stream(media, streamerParams);
    }
  }, [streamerParams, media]);

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
