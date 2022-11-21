import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const home = router({
  tweets: protectedProcedure
    .input(
      z.object({
        cursor: z.number().nullish(),
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

      const followedIdsAndMe = [...followedIds, sessionUserId];

      const items = await ctx.prisma.tweet.findMany({
        orderBy: { createdAt: "desc" },
        cursor: input.cursor ? { id: input.cursor } : undefined,
        take: limit + 1, //get one extra (use it for cursor to next query)
        where: {
          OR: [
            //any tweets/replies/retweets by self
            { authorId: sessionUserId },
            //tweets that are not replies by followed users
            {
              authorId: { in: followedIds },
              repliedToTweetId: null,
            },
            //tweets that are replies by followed users if also following the replied to user
            {
              authorId: { in: followedIdsAndMe },
              repliedToTweet: {
                authorId: { in: followedIdsAndMe },
              },
            },
            //tweets that are liked by followed users
            {
              likes: {
                some: {
                  userId: { in: followedIds },
                },
              },
            },
          ],
        },
        include: {
          _count: {
            select: { replies: true, retweets: true, likes: true },
          },
          author: true,
          likes: {
            where: {
              userId: { in: followedIds },
            },
            select: {
              userId: true,
              user: {
                select: {
                  handle: true,
                },
              },
            },
          },
          retweets: {
            where: {
              authorId: { in: followedIds },
            },
            select: {
              authorId: true,
              author: {
                select: {
                  handle: true,
                },
              },
            },
          },
          repliedToTweet: {
            select: {
              id: true,
              authorId: true,
              author: {
                select: {
                  handle: true,
                },
              },
            },
          },
          retweetedToTweet: {
            include: {
              _count: {
                select: { replies: true, retweets: true, likes: true },
              },
              author: true,
            },
          },
        },
      });

      let nextCursor: number | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop(); //dont return the one extra
        nextCursor = nextItem?.id;
      }
      return { items, nextCursor };
    }),
});
