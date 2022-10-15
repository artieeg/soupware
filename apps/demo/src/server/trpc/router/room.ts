import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { createRoom } from "../../app";

export const roomRouter = router({
  create: publicProcedure.input(z.object({})).mutation(async () => {
    return await createRoom();
  }),
});
