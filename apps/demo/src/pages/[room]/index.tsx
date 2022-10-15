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
import { useEffect } from "react";
import { stream } from "../../app";
import { trpc } from "../../utils/trpc";
import { useRoomId } from "../../hooks/useRoomId";

const useMediaStreaming = () => {
  const router = useRouter();
  const room = router.query.room as string;

  const { media } = useUserMedia();
  const client = useSoupwareClient();
  const streamerParams = useStreamerParams(room);
  const connectStreamerMutation = trpc.streamer.connect.useMutation();

  const connect = async () => {
    if (!client || !streamerParams) return;

    const {
      transportConnectParams: { routerRtpParameters, transportOptions },
    } = streamerParams;

    const transport = await client.createSendTransport(
      routerRtpParameters,
      transportOptions,
      (params) => {
        return connectStreamerMutation.mutateAsync({
          dtlsParameters: params.dtls,
          mediaPermissionToken: params.mediaPermissionToken,
          rtpCapabilities: params.rtpCapabilities,
        });
      }
    );

    console.log({ transport });
  };

  useEffect(() => {
    connect();
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
