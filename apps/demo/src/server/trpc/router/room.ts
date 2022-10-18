import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { createRoom, createUserStreamer } from "../../app";

export const roomRouter = router({
  create: publicProcedure.input(z.object({})).mutation(async () => {
    const room = await createRoom();
    const user = await createUserStreamer(room.id);

    return { room, user };
  }),
});
