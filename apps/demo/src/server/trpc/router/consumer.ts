import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { connectConsumer, consume, createConsumer } from "../../app/consumer";

export const consumerRouter = router({
  create: publicProcedure
    .input(
      z.object({
        room: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return await createConsumer(input.room);
    }),
  connect: publicProcedure
    .input(
      z.object({
        dtlsParameters: z.any(),
        mediaPermissionToken: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await connectConsumer({
        dtlsParameters: input.dtlsParameters,
        mediaPermissionToken: input.mediaPermissionToken,
      });
    }),
  consume: publicProcedure
    .input(
      z.object({
        mediaPermissionToken: z.string(),
        rtpCapabilities: z.any(),
      })
    )
    .mutation(({ input }) => {
      return consume(input as any);
    }),
});
