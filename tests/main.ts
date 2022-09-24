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

  const createStreamerResponse = await axios.post("/streamer", {
    user: "user0",
  });

  const {
    transportConnectParams: { transportOptions, routerRtpParameters },
  } = createStreamerResponse.data;

  await sendDevice.load({ routerRtpCapabilities: routerRtpParameters });
  const transport = sendDevice.createSendTransport(transportOptions);

  const stream = await worker.getUserMedia({
    audio: false,
    video: {
      source: "file",
      file: `file://${media.videos[0]}`,
    },
  });

  transport.on("connect", ({ dtlsParameters }, cb, errb) => {
    console.log("trying to connect transport", dtlsParameters);
  });

  transport.on("produce", (produceParams) => {
    console.log(produceParams);
  });

  transport.produce({ track: stream.getVideoTracks()[0] });
}
