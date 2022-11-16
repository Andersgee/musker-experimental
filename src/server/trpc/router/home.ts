import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { type Prisma } from "@prisma/client";

//export const tweetsInclude: NonNullable<Prisma.TweetFindManyArgs["include"]> = {
export const tweetsInclude = {
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

/**
 * home
 * 1. tweets from this user
 * 2. tweets from followed users
 * 3. likes from followed users
 * 4. retweets from followed users
 * 5. replies from followed users if also following the repliedto user
 * 6. ---TODO--- mentions from followed users if also following the mentioned user
 */
function tweetHomeWhereArg(sessionUserId: string, followedIds: string[]) {
  //const tweetHomeWhere: NonNullable<Prisma.TweetFindManyArgs["where"]> = {
  const tweetHomeWhere = {
    OR: [
      //1
      { authorId: sessionUserId },
      //2
      { authorId: { in: followedIds } },
      //3
      {
        tweetLikes: {
          some: {
            userId: { in: followedIds },
          },
        },
      },
      //4
      {
        retweets: {
          some: {
            userId: { in: followedIds },
          },
        },
      },
      //5
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
        cursor: input.cursor ? { id: input.cursor } : undefined,
        take: limit + 1, //get one extra (use it for cursor to next query)
        orderBy: { createdAt: "desc" },
        //where: { authorId: { in: [...followedIds, sessionUserId] } },
        where: tweetHomeWhereArg(sessionUserId, followedIds),
        include: tweetsInclude,
      });

      let nextCursor: string | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop(); //dont return the one extra
        nextCursor = nextItem?.id;
      }
      return { items, nextCursor };
    }),
});
