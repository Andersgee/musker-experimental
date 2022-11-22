import { z } from "zod";
import { router, publicProcedure } from "../trpc";
//import { type Prisma } from "@prisma/client";

export const profile = router({
  tweets: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        cursor: z.number().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const limit = 30;
      const userId = input.userId;

      const userWithTweets = await ctx.prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          tweets: {
            orderBy: { createdAt: "desc" },
            take: limit + 1,
            cursor: input.cursor ? { id: input.cursor } : undefined,
            include: {
              _count: {
                select: { replies: true, retweets: true, likes: true },
              },
              author: true,
              retweetedToTweet: {
                include: {
                  _count: {
                    select: { replies: true, retweets: true, likes: true },
                  },
                  author: true,
                },
              },
              repliedToTweet: {
                select: {
                  authorId: true,
                  id: true,
                  author: {
                    select: {
                      handle: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      const items = userWithTweets?.tweets || [];

      let nextCursor: number | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop(); //dont return the one extra
        nextCursor = nextItem?.id;
      }
      return { items, nextCursor };
    }),
  tweetsWithoutReplies: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        cursor: z.number().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const limit = 30;
      const userId = input.userId;

      const userWithTweets = await ctx.prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          tweets: {
            where: {
              repliedToTweetId: null,
            },
            orderBy: { createdAt: "desc" },
            take: limit + 1,
            cursor: input.cursor ? { id: input.cursor } : undefined,
            include: {
              _count: {
                select: { replies: true, retweets: true, likes: true },
              },
              author: true,
              retweetedToTweet: {
                include: {
                  _count: {
                    select: { replies: true, retweets: true, likes: true },
                  },
                  author: true,
                },
              },
              repliedToTweet: {
                select: {
                  authorId: true,
                  id: true,
                  author: {
                    select: {
                      handle: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      const items = userWithTweets?.tweets || [];

      let nextCursor: number | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop(); //dont return the one extra
        nextCursor = nextItem?.id;
      }
      return { items, nextCursor };
    }),
  likes: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        cursor: z.number().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const limit = 30;
      const userId = input.userId;

      const userWithLikes = await ctx.prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          tweetLikes: {
            orderBy: { createdAt: "desc" },
            take: limit + 1,
            cursor: input.cursor
              ? {
                  userId_tweetId: {
                    userId: userId,
                    tweetId: input.cursor,
                  },
                }
              : undefined,
            include: {
              tweet: {
                include: {
                  _count: {
                    select: { replies: true, retweets: true, likes: true },
                  },
                  author: true,
                },
              },
            },
          },
        },
      });
      const items = userWithLikes?.tweetLikes || [];

      let nextCursor: number | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop(); //dont return the one extra
        nextCursor = nextItem?.tweetId;
      }
      return { items, nextCursor };
    }),
});
