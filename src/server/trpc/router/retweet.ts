import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

//import { type Prisma } from "@prisma/client";

export const retweetRouter = router({
  getById: protectedProcedure
    .input(
      z.object({
        tweetId: z.string(),
      }),
    )
    .query(({ input, ctx }) => {
      return ctx.prisma.retweet.findUnique({
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
      return ctx.prisma.retweet.create({
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
      return ctx.prisma.retweet.delete({
        where: {
          userId_tweetId: {
            userId: ctx.session.user.id,
            tweetId: input.tweetId,
          },
        },
      });
    }),
});
