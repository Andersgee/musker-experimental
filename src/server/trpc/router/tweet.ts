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
        tweetId: z.number(),
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
        tweetId: z.number(),
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
        tweetId: z.number(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.tweetLike.findUnique({
        where: {
          userId_tweetId: {
            tweetId: input.tweetId,
            userId: ctx.session.user.id,
          },
        },
      });
    }),
  like: protectedProcedure
    .input(
      z.object({
        tweetId: z.number(),
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
        tweetId: z.number(),
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
        tweetId: z.number(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.tweet.findFirst({
        where: {
          authorId: ctx.session.user.id,
          retweetedToTweetId: input.tweetId,
        },
      });
    }),
  retweet: protectedProcedure
    .input(
      z.object({
        text: z.string(),
        tweetId: z.number(),
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
  /**
   * tweetId is the original tweets id.
   * use tweet.delete() instead if you already have the actual retweeted id.
   * */
  unretweet: protectedProcedure
    .input(
      z.object({
        tweetId: z.number(),
      }),
    )
    .mutation(({ ctx, input }) => {
      //must use deleteMany since delete is only by id
      return ctx.prisma.tweet.deleteMany({
        where: {
          authorId: ctx.session.user.id,
          retweetedToTweetId: input.tweetId,
        },
      });
    }),
});
