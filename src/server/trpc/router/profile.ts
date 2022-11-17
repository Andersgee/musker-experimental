import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../trpc";
import { type Prisma } from "@prisma/client";

/**
 * for readability, put this stuff in function
 *
 * 1. tweets from this user
 * 2. retweets from this user
 * 3. likes from this user
 */
function tweetsWhereInput(userId: string) {
  const where: NonNullable<Prisma.TweetFindManyArgs["where"]> = {
    //const tweetHomeWhere = {
    OR: [
      //1
      { authorId: userId },

      //3
      {
        likes: {
          some: {
            userId: { in: userId },
          },
        },
      },
    ],
  };

  return where;
}

export const profile = router({
  tweets: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        cursor: z.string().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const limit = 30;
      const userId = input.userId;

      const items = await ctx.prisma.tweet.findMany({
        orderBy: { createdAt: "desc" },
        cursor: input.cursor ? { id: input.cursor } : undefined,
        take: limit + 1, //get one extra (use it for cursor to next query)
        where: tweetsWhereInput(userId),
        include: {
          _count: {
            select: { replies: true, retweets: true, likes: true },
          },
          author: {
            include: { handle: true },
          },
          repliedToTweet: {
            select: {
              author: {
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
          likes: {
            where: {
              userId: userId,
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
