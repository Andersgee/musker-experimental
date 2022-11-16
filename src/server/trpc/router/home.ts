import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { type Prisma } from "@prisma/client";

/**
 * for readability, put this stuff in function
 *
 * 1. tweets from this user
 * 2. tweets from followed users
 * 3. tweets/retweets from this user
 * 4. retweets from this user followed users
 * 5. likes from followed users
 * 6. replies from followed users if also following the repliedto user
 * 7. ---TODO--- mentions from followed users if also following the mentioned user
 */
function tweetsWhereInput(sessionUserId: string, followedIds: string[]) {
  const ids = [...followedIds, sessionUserId];
  const tweetHomeWhere: NonNullable<Prisma.TweetFindManyArgs["where"]> = {
    //const tweetHomeWhere = {
    OR: [
      //1, 2
      { authorId: { in: ids } },
      //3, 4
      {
        retweets: {
          some: {
            userId: { in: ids },
          },
        },
      },
      //5
      {
        tweetLikes: {
          some: {
            userId: { in: followedIds },
          },
        },
      },
      //6
      {
        AND: [
          { authorId: { in: followedIds } },
          {
            parentTweet: {
              authorId: { in: followedIds },
            },
          },
        ],
      },
    ],
  };

  return tweetHomeWhere;
}

export const home = router({
  tweets: protectedProcedure
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
        select: {
          sentFollows: {
            select: {
              userId: true,
            },
          },
        },
      });

      const followedIds = user?.sentFollows.map((follow) => follow.userId) || [];

      const items = await ctx.prisma.tweet.findMany({
        orderBy: { createdAt: "desc" },
        cursor: input.cursor ? { id: input.cursor } : undefined,
        take: limit + 1, //get one extra (use it for cursor to next query)
        where: tweetsWhereInput(sessionUserId, followedIds),
        include: {
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
          tweetLikes: {
            where: {
              userId: { in: followedIds },
            },
            select: {
              userId: true,
              user: {
                select: {
                  handle: {
                    select: {
                      text: true,
                    },
                  },
                },
              },
            },
          },
          retweets: {
            where: {
              userId: { in: followedIds },
            },
            select: {
              userId: true,
              user: {
                select: {
                  handle: {
                    select: {
                      text: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      let nextCursor: string | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop(); //dont return the one extra
        nextCursor = nextItem?.id;
      }
      return { items, nextCursor };
    }),
});
