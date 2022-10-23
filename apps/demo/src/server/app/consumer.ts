import { soupware } from "./soupware";

export function getConsumerParams(room: string, user: string) {
  return soupware.consumer.create({
    user,
    room,
  });
}

export function connectConsumer(params: {
  mediaPermissionToken: string;
  dtlsParameters: any;
}) {
  return soupware.consumer.connect(params);
}

export function consume(params: {
  mediaPermissionToken: string;
  rtpCapabilities: any;
}) {
  return soupware.consumer.consume(params);
}
