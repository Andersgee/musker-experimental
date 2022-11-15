import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { type Prisma } from "@prisma/client";

/**
 * common arg for what to include in tweet across different queries
 *
 * TODO: hearts and retweets and more possible parent tweets (up to 3?)
 *
 * in fact, might want to do an "activity" router instead
 * where a profile page can query that users activity
 * and homefeed can query all the ctx.users sentFollows activities
 */

//const tweetInclude: Prisma.TweetFindManyArgs["include"] = {
export const tweetInclude = {
  author: {
    include: { handle: true },
  },
  _count: {
    select: { childTweets: true, tweetLikes: true },
  },
  parentTweet: {
    include: {
      author: {
        include: { handle: true },
      },
      _count: {
        select: { childTweets: true, tweetLikes: true },
      },
    },
  },
};

export const activityRouter = router({
  followedActivity: protectedProcedure
    .input(
      z.object({
        cursor: z.string().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const limit = 30;

      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.session.user.id },
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
        where: {
          OR: [
            { authorId: { in: followedIds } },
            {
              tweetLikes: {
                some: {
                  userId: { in: followedIds },
                },
              },
            },
            {
              retweets: {
                some: {
                  userId: { in: followedIds },
                },
              },
            },
          ],
        },
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
