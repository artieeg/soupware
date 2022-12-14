import type { NextPage } from "next";
import Head from "next/head";
import { TextButton } from "../components";
import { trpc } from "../utils/trpc";
import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/router";
import { AppLayout } from "../layouts";
import { useRoleStore, useStreamerStore, useConsumerStore } from "../store";
import { SoupwareClient } from "@soupware/client";
import { useSignalers } from "../hooks";

const Home: NextPage = () => {
  const router = useRouter();
  const createRoomMutation = trpc.room.create.useMutation();

  const [hidden, setHidden] = useState(false);
  const signalers = useSignalers();

  const onCreateRoom = async () => {
    const { room, user } = await createRoomMutation.mutateAsync({});
    setHidden(true);

    useRoleStore.setState({
      role: "streamer",
    });

    useConsumerStore.setState({
      params: user.consumer,
      client: new SoupwareClient(user.consumer.mediaPermissionToken, signalers),
    });

    useStreamerStore.setState({
      params: user.streamer,
      client: new SoupwareClient(user.streamer.mediaPermissionToken, signalers),
    });

    router.push(`/${room.id}?role=streamer`);
  };

  return (
    <>
      <Head>
        <title>soupware demo</title>
        <meta name="description" content="Soupware project demo" />
      </Head>

      <AppLayout className="mx-auto  items-center justify-center p-6">
        <motion.div
          className="space-y-[5rem]"
          animate={hidden ? "hidden" : "visible"}
          variants={{
            hidden: { opacity: 0, scale: 1.5, transition: { duration: 0.2 } },
            visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
          }}
        >
          <h6 className="text-center text-5xl font-extrabold leading-normal text-brand-0 md:text-[5rem]">
            Soupdemo 👋
          </h6>
          <TextButton
            disabled={hidden}
            title="Create New Room"
            onClick={onCreateRoom}
          />
        </motion.div>
      </AppLayout>
    </>
  );
};

export default Home;
