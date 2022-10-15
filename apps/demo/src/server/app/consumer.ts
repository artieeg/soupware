import { soupware } from "./soupware";

export function createConsumer(room: string, user: string) {
  return soupware.consumer.create({
    user,
    room,
  });
}
