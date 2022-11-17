import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
//import { type Prisma } from "@prisma/client";

export const tweet = router({
  create: protectedProcedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.tweet.create({
        data: {
          authorId: ctx.session.user.id,
          text: input.text,
        },
      });
    }),
  reply: protectedProcedure
    .input(
      z.object({
        tweetId: z.string(),
        text: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.tweet.create({
        data: {
          repliedToTweetId: input.tweetId,
          authorId: ctx.session.user.id,
          text: input.text,
        },
      });
    }),
  delete: protectedProcedure
    .input(
      z.object({
        tweetId: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.tweet.delete({
        where: { id: input.tweetId },
      });
    }),
  existingLike: protectedProcedure
    .input(
      z.object({
        tweetId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const like = await ctx.prisma.tweetLike.findUnique({
        where: {
          userId_tweetId: {
            tweetId: input.tweetId,
            userId: ctx.session.user.id,
          },
        },
      });
      return like;
    }),
  like: protectedProcedure
    .input(
      z.object({
        tweetId: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.tweetLike.create({
        data: {
          tweetId: input.tweetId,
          userId: ctx.session.user.id,
        },
      });
    }),
  unlike: protectedProcedure
    .input(
      z.object({
        tweetId: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.tweetLike.delete({
        where: {
          userId_tweetId: {
            tweetId: input.tweetId,
            userId: ctx.session.user.id,
          },
        },
      });
    }),
  existingRetweet: protectedProcedure
    .input(
      z.object({
        tweetId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const tweet = await ctx.prisma.tweet.findUnique({
        where: { id: input.tweetId },
        select: {
          retweets: {
            where: {
              authorId: input.tweetId,
            },
          },
        },
      });
      if (tweet && tweet.retweets[0]) {
        return tweet.retweets[0];
      } else {
        return null;
      }
    }),
  retweet: protectedProcedure
    .input(
      z.object({
        text: z.string(),
        tweetId: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.tweet.create({
        data: {
          authorId: ctx.session.user.id,
          retweetedToTweetId: input.tweetId,
          text: input.text,
        },
      });
    }),
  unretweet: protectedProcedure
    .input(
      z.object({
        tweetId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const tweet = await ctx.prisma.tweet.findUnique({
        where: {
          id: input.tweetId,
        },
        select: {
          retweets: {
            where: {
              authorId: ctx.session.user.id,
            },
            select: {
              id: true,
            },
          },
        },
      });
      const retweetId = tweet?.retweets[0]?.id;
      return ctx.prisma.tweet.delete({
        where: {
          id: retweetId,
        },
      });
    }),
});
