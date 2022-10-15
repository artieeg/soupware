import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { connectStreamer, produce } from "../../app/streamer";

export const streamerRouter = router({
  connect: publicProcedure
    .input(
      z.object({
        dtlsParameters: z.any(),
        mediaPermissionToken: z.string(),
        rtpCapabilities: z.any(),
      })
    )
    .mutation(async ({ input }) => {
      await connectStreamer({
        dtlsParameters: input.dtlsParameters,
        mediaPermissionToken: input.mediaPermissionToken,
        rtpCapabilities: input.rtpCapabilities,
      });
    }),
  produce: publicProcedure
    .input(
      z.object({
        producerOptions: z.any(),
        mediaPermissionToken: z.string(),
      })
    )
    .mutation(({ input }) => {
      return produce(input as any); //oops
    }),
});
