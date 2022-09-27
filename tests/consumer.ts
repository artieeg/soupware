import axios from "axios";
import { createWorker } from "mediasoup-client-aiortc";
import { Device } from "mediasoup-client";
import { Consumer } from "mediasoup-client/lib/Consumer";

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

  const consumerResponse = await axios.post("/viewer/consumer", {
    room,
    user,
    recvNodeId,
    rtpCapabilities: recvDevice.rtpCapabilities,
  });

  const params = consumerResponse.data.consumerParameters;
  console.log(params);

  const consumers: Consumer[] = await Promise.all(
    params.map(({ consumerParameters: consumer }: any) =>
      transport.consume({
        id: consumer.id,
        producerId: consumer.producerId,
        kind: consumer.kind,
        rtpParameters: consumer.rtpParameters,
        appData: {},
      })
    )
  );

  setInterval(() => {
    console.log(consumers[0].getStats());
  }, 1000);
}

main();
