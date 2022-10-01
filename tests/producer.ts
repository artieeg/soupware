import axios from "axios";
import { createWorker } from "mediasoup-client-aiortc";
import { Device } from "mediasoup-client";
import path from "path";
import fs from "fs";

const URL = process.env.URL || "http://192.168.1.20:3000";
axios.defaults.baseURL = URL;

const media = {
  videos: [] as string[],
  audios: [] as string[],
};

export async function main() {
  const files = fs.readdirSync("./media");
  files.forEach((file) => {
    const p = path.resolve("./media", file);

    if (p.endsWith(".mp4")) {
      media.videos.push(p);
    } else {
      media.audios.push(p);
    }
  });

  const worker = await createWorker({ logLevel: "debug" });
  const sendDevice = new Device({
    handlerFactory: worker.createHandlerFactory(),
  });

  const user = process.env.S_UID ?? "user0";
  const room = "room0";

  const createStreamerResponse = await axios.post("/streamer", {
    user,
    room,
    permissions: {
      audio: true,
      video: true,
    },
  });

  const {
    transportConnectParams: { transportOptions, routerRtpParameters },
    mediaPermissionToken,
  } = createStreamerResponse.data;

  await sendDevice.load({ routerRtpCapabilities: routerRtpParameters });
  const transport = sendDevice.createSendTransport(transportOptions);

  const userMedia = await worker.getUserMedia({
    audio: false,
    video: {
      source: "file",
      file: `file://${media.videos[0]}`,
    },
  });

  transport.on("connect", async ({ dtlsParameters }, cb, errb) => {
    console.log("connect", dtlsParameters);

    try {
      await axios.put("/streamer", {
        dtlsParameters,
        mediaPermissionToken,
        rtpCapabilities: sendDevice.rtpCapabilities,
      });

      cb();
    } catch {
      errb(new Error());
    }
  });

  transport.on("produce", async (producerOptions, cb, erb) => {
    console.log("producer", producerOptions);

    try {
      const { id } = (
        await axios.post("/streamer/producer", {
          producerOptions,
          mediaPermissionToken,
        })
      ).data;

      setTimeout(async () => {
        console.log("closing producer");
        await axios.delete("/streamer/producer", {
          data: {
            user,
            room,
            kinds: {
              audio: true,
              video: true,
            },
          },
        });
      }, 10000);

      cb({ id });
    } catch {
      erb(new Error());
    }
  });

  const p = await transport.produce({ track: userMedia.getVideoTracks()[0] });
}

main();
