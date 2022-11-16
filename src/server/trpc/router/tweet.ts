import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { type Prisma } from "@prisma/client";

/**
 * use this const in include whenever using prisma.tweet.find calls.
 */
//export const tweetInclude: Prisma.TweetFindManyArgs["include"] = {
export const tweetInclude = {
  author: {
    include: { handle: true },
  },
  _count: {
    select: { childTweets: true, tweetLikes: true, retweets: true },
  },
  parentTweet: {
    include: {
      author: {
        include: { handle: true },
      },
      _count: {
        select: { childTweets: true, tweetLikes: true, retweets: true },
      },
    },
  },
};

//export const tweetHomeInclude: NonNullable<Prisma.TweetFindManyArgs["include"]> = {
export const homeInclude = {
  author: {
    include: { handle: true },
  },
  _count: {
    select: { childTweets: true, tweetLikes: true, retweets: true },
  },
  parentTweet: {
    include: {
      author: {
        include: { handle: true },
      },
      _count: {
        select: { childTweets: true, tweetLikes: true, retweets: true },
      },
    },
  },
};

export const tweetRouter = router({
  getById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(({ input, ctx }) => {
      return ctx.prisma.tweet.findUnique({ where: { id: input.id } });
    }),
  create: protectedProcedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.tweet.create({
        data: {
          authorId: ctx.session.user.id,
          text: input.text,
        },
      });
    }),
  createReply: protectedProcedure
    .input(
      z.object({
        parentTweetId: z.string(),
        text: z.string(),
      }),
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.tweet.create({
        data: {
          authorId: ctx.session.user.id,
          parentTweetId: input.parentTweetId,
          text: input.text,
        },
      });
    }),
  homeFeed: protectedProcedure
    .input(
      z.object({
        cursor: z.string().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const limit = 30;
      const sessionUserId = ctx.session.user.id;

      const user = await ctx.prisma.user.findUnique({
        where: { id: sessionUserId },
        include: {
          sentFollows: true,
        },
      });

      //the ids this user is following
      const followedIds = user?.sentFollows.map((follow) => follow.userId) || [];

      const items = await ctx.prisma.tweet.findMany({
        cursor: input.cursor ? { id: input.cursor } : undefined,
        take: limit + 1, //get one extra (use it for cursor to next query)
        orderBy: { createdAt: "desc" },
        where: { authorId: { in: [...followedIds, sessionUserId] } },
        //where: { authorId: { in: followedIds } },
        include: tweetInclude,
      });

      let nextCursor: string | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop(); //dont return the one extra
        nextCursor = nextItem?.id;
      }
      return { items, nextCursor };
    }),
  exploreFeed: publicProcedure
    .input(
      z.object({
        cursor: z.string().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const limit = 10;

      const items = await ctx.prisma.tweet.findMany({
        cursor: input.cursor ? { id: input.cursor } : undefined,
        take: limit + 1, //get one extra (use it for cursor to next query)
        orderBy: { createdAt: "desc" },
        include: tweetInclude,
      });

      let nextCursor: string | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop(); //dont return the one extra
        nextCursor = nextItem?.id;
      }
      return { items, nextCursor };
    }),
  replies: publicProcedure
    .input(
      z.object({
        tweetId: z.string(),
        cursor: z.string().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const limit = 10;

      const items = await ctx.prisma.tweet.findMany({
        where: { parentTweetId: input.tweetId },
        cursor: input.cursor ? { id: input.cursor } : undefined,
        take: limit + 1, //get one extra (use it for cursor to next query)
        orderBy: { createdAt: "desc" },
        include: tweetInclude,
      });

      let nextCursor: string | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop(); //dont return the one extra
        nextCursor = nextItem?.id;
      }
      return { items, nextCursor };
    }),
  byUser: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        cursor: z.string().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const limit = 10;

      const items = await ctx.prisma.tweet.findMany({
        where: { authorId: input.userId },
        cursor: input.cursor ? { id: input.cursor } : undefined,
        take: limit + 1, //get one extra (use it for cursor to next query)
        orderBy: { createdAt: "desc" },
        include: tweetInclude,
      });

      let nextCursor: string | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop(); //dont return the one extra
        nextCursor = nextItem?.id;
      }
      return { items, nextCursor };
    }),
});
