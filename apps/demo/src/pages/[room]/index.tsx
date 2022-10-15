import Head from "next/head";
import { useRouter } from "next/router";
import { NextPage } from "next";
import { AppLayout } from "../../layouts";
import { useUserMedia } from "../../hooks";

const Room: NextPage = () => {
  const router = useRouter();
  const room = router.query.room as string;

  const userMedia = useUserMedia();

  return (
    <>
      <Head>
        <title>soupdemo {room}</title>
        <meta name="description" content={`Soupdemo Room ${room}`} />
      </Head>

      <AppLayout>
        {userMedia.loading ? (
          <div>loading</div>
        ) : (
          <video
            className="h-[20rem] w-[20rem] rounded-full object-cover"
            autoPlay
            playsInline
            muted
            ref={(ref) => {
              if (ref && userMedia.media) {
                ref.srcObject = userMedia.media;
              }
            }}
          />
        )}
      </AppLayout>
    </>
  );
};

export default Room;
