import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { createRoom, createUser } from "../../app";

export const roomRouter = router({
  create: publicProcedure.input(z.object({})).mutation(async () => {
    const room = await createRoom();
    const user = await createUser(room.id, "streamer");

    return { room, user };
  }),
});
