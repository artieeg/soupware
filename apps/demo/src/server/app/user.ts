import { generateSlug } from "random-word-slugs";
import { Role, User } from "../../types";
import { getConsumerParams } from "./consumer";
import { ee } from "./ee";
import { getStreamerParams } from "./streamer";

//TODO: replace with redis
const users = new Map<string, User>();

export async function createUser(room: string, role: Role) {
  const id = generateSlug();

  const user: User = {
    id,
    room,
    role,
  };

  users.set(room, user);
  ee.emit("user", user);

  return user;
}

export async function getUsersInRoom(room: string) {
  return users.get(room);
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
