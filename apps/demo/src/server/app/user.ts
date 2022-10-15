import { nanoid } from "nanoid";
import { Role } from "../types";
import { createConsumer } from "./consumer";
import { createStreamer } from "./streamer";

export async function createUser(room: string, role: Role) {
  const id = nanoid();

  // Regardless of role, users should be able to consume streams
  const consumer = await createConsumer(room, id);

  if (role === "streamer") {
    const streamer = await createStreamer(room, id);

    return { consumer, streamer };
  }

  return { consumer };
}
