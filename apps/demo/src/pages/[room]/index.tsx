import Head from "next/head";
import { useRouter } from "next/router";
import { NextPage } from "next";
import { useStreamerParams } from "../../hooks/useStreamerParams";
import { useEffect } from "react";

const Room: NextPage = () => {
  const router = useRouter();
  const room = router.query.room as string;

  const params = useStreamerParams(room);

  return (
    <>
      <Head>
        <title>soupdemo {room}</title>
        <meta name="description" content={`Soupdemo Room ${room}`} />
      </Head>
    </>
  );
};

export default Room;
