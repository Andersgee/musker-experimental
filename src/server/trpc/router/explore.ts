import { z } from "zod";
import { router, publicProcedure } from "../trpc";
//import { type Prisma } from "@prisma/client";

export const explore = router({
  tweets: publicProcedure
    .input(
      z.object({
        cursor: z.string().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const limit = 30;

      const items = await ctx.prisma.tweet.findMany({
        orderBy: { createdAt: "desc" },
        cursor: input.cursor ? { id: input.cursor } : undefined,
        take: limit + 1,
        //where: {authorId: userId},
        include: {
          _count: {
            select: { replies: true, retweets: true, likes: true },
          },
          author: {
            include: { handle: true },
          },
          retweetedToTweet: {
            include: {
              _count: {
                select: { replies: true, retweets: true, likes: true },
              },
              author: {
                include: {
                  handle: true,
                },
              },
            },
          },
          repliedToTweet: {
            select: {
              id: true,
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
