import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { createRoom, createUserStreamer, User } from "../../app";
import { observable } from "@trpc/server/observable";
import { ee } from "../../app/ee";

export const roomRouter = router({
  create: publicProcedure.input(z.object({})).mutation(async () => {
    const room = await createRoom();
    const user = await createUserStreamer(room.id);

    return { room, user };
  }),

  onNewUser: publicProcedure
    .input(z.object({ room: z.string() }))
    .subscription(({ input: { room } }) => {
      return observable<User>((emit) => {
        const newNewUser = (user: User) => {
          if (user.room === room) {
            emit.next(user);
          }
        };

        ee.on("user", newNewUser);

        return () => {
          ee.off("user", newNewUser);
        };
      });
    }),
});
