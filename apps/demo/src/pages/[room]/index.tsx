import Head from "next/head";
import { NextPage } from "next";
import { AppLayout } from "../../layouts";
import { useMediaStreaming, useUserMedia } from "../../hooks";
import { UserCircle } from "../../components";
import { useRoomId } from "../../hooks/useRoomId";
import { useMemo } from "react";
import { useMediaConsumers } from "../../hooks/useMediaConsumers";

const Room: NextPage = () => {
  const room = useRoomId();
  const { media: userMedia } = useUserMedia();

  useMediaStreaming();
  const streams = useMediaConsumers();

  const media = [userMedia, ...streams];

  const mediaViews = useMemo(() => {
    //Array of pairs
    const pairs = media.reduce((prev, cur, i) => {
      if (!cur) return prev;

      if (i % 2 === 0) {
        prev.push([cur]);
      } else {
        prev[prev.length - 1]?.push(cur);
      }

      return prev;
    }, [] as MediaStream[][]);

    return pairs.map(([first, second]) => (
      <div
        key={first?.id}
        className={`flex w-full ${
          media.length === 2 ? "flex-[0.5]" : "flex-1"
        } space-x-[5rem] overflow-hidden rounded-[2rem]`}
      >
        {first && <UserCircle media={first} />}
        {second && <UserCircle media={second} />}
      </div>
    ));
  }, [media]);

  return (
    <>
      <Head>
        <title>soupdemo {room}</title>
        <meta name="description" content={`Soupdemo room ${room}`} />
      </Head>

      <AppLayout>
        <div className="flex max-h-screen flex-1 flex-row p-[5rem]">
          <div
            className={`mr-[5rem] flex flex-[0.75] flex-col overflow-hidden rounded-[2rem] ${
              mediaViews.length > 1 ? "space-y-[5rem]" : "justify-center"
            }`}
          >
            {mediaViews}
          </div>

          <div className="min-h-full flex-[0.25] rounded-[2rem] bg-gray-1100 p-[2rem]">
            <h3 className="text-3xl font-bold text-white">Participants</h3>
          </div>
        </div>
      </AppLayout>
    </>
  );
};

export default Room;
