import { generateSlug } from "random-word-slugs";
import { Role } from "../../types";
import { getConsumerParams } from "./consumer";
import { getStreamerParams } from "./streamer";

export async function createUser(room: string, role: Role) {
  const id = generateSlug();

  const user = {
    id,
    room,
    role,
  };

  return user;
}

export async function createUserStreamer(room: string) {
  const user = await createUser(room, "streamer");

  const consumer = await getConsumerParams(room, user.id);
  const streamer = await getStreamerParams(room, user.id);

  return { user, streamer, consumer };
}

export async function createUserViewer(room: string) {
  const user = await createUser(room, "viewer");

  const consumer = await getConsumerParams(room, user.id);

  return {
    user,
    consumer,
  };
}
