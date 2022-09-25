import axios from "axios";
import { createWorker } from "mediasoup-client-aiortc";
import { Device } from "mediasoup-client";

const URL = process.env.URL || "http://192.168.1.20:3000";
axios.defaults.baseURL = URL;

async function main() {
  const worker = await createWorker({});
  const recvDevice = new Device({
    handlerFactory: worker.createHandlerFactory(),
  });

  const user = "user1";
  const room = "room0";

  const createViewerResponse = await axios.post("/viewer", {
    user,
    room,
  });

  const {
    transportConnectParams: { transportOptions, routerRtpParameters },
    recvNodeId,
  } = createViewerResponse.data;

  await recvDevice.load({ routerRtpCapabilities: routerRtpParameters });
  const transport = recvDevice.createRecvTransport(transportOptions);

  transport.on("connect", async ({ dtlsParameters }, cb, erb) => {
    console.log({ dtlsParameters });
  });

  await axios.post("/viewer/consumer", { room, recvNodeId });
}

main();
