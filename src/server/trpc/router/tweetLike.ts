import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

//import { type Prisma } from "@prisma/client";

export const tweetLikeRouter = router({
  getById: protectedProcedure
    .input(
      z.object({
        tweetId: z.string(),
      }),
    )
    .query(({ input, ctx }) => {
      return ctx.prisma.tweetLike.findUnique({
        where: {
          userId_tweetId: {
            userId: ctx.session.user.id,
            tweetId: input.tweetId,
          },
        },
      });
    }),
  like: protectedProcedure
    .input(
      z.object({
        tweetId: z.string(),
      }),
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.tweetLike.create({
        data: {
          userId: ctx.session.user.id,
          tweetId: input.tweetId,
        },
      });
    }),
  unlike: protectedProcedure
    .input(
      z.object({
        tweetId: z.string(),
      }),
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.tweetLike.delete({
        where: {
          userId_tweetId: {
            userId: ctx.session.user.id,
            tweetId: input.tweetId,
          },
        },
      });
    }),
});
