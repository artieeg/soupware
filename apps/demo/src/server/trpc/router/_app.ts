import { router } from "../trpc";
import { consumerRouter } from "./consumer";

import { roomRouter } from "./room";
import { streamerRouter } from "./streamer";

export const appRouter = router({
  room: roomRouter,
  streamer: streamerRouter,
  viewer: consumerRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
