import Head from "next/head";
import { NextPage } from "next";
import { AppLayout } from "../../layouts";
import { useMediaStreaming, useUserMedia } from "../../hooks";
import { UserCircle } from "../../components";
import { useRoomId } from "../../hooks/useRoomId";
import { useMediaConsumers } from "../../hooks/useMediaConsumers";
import { useEffect } from "react";

const Room: NextPage = () => {
  const room = useRoomId();
  const { media } = useUserMedia();

  useMediaStreaming();
  const consumers = useMediaConsumers();

  useEffect(() => {
    console.log({ consumers });
  }, [consumers]);

  return (
    <>
      <Head>
        <title>soupdemo {room}</title>
        <meta name="description" content={`Soupdemo room ${room}`} />
      </Head>

      <AppLayout>
        <div>
          <UserCircle media={media} />
        </div>
        <div>
          {consumers?.map((t) => (
            <UserCircle key={t.id} media={t} />
          ))}
        </div>
      </AppLayout>
    </>
  );
};

export default Room;
