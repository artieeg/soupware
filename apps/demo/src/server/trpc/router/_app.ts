import { router } from "../trpc";

import { roomRouter } from "./room";
import { streamerRouter } from "./streamer";

export const appRouter = router({
  room: roomRouter,
  streamer: streamerRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
