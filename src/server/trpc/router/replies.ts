import { z } from "zod";
import { router, publicProcedure } from "../trpc";
//import { type Prisma } from "@prisma/client";

export const replies = router({
  tweets: publicProcedure
    .input(
      z.object({
        tweetId: z.number(),
        cursor: z.number().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const limit = 10;

      const tweetWithReplies = await ctx.prisma.tweet.findUnique({
        where: {
          id: input.tweetId,
        },
        select: {
          replies: {
            orderBy: { createdAt: "desc" },
            take: limit + 1,
            cursor: input.cursor ? { id: input.cursor } : undefined,
            include: {
              author: true,
              _count: {
                select: { replies: true, retweets: true, likes: true },
              },
            },
          },
        },
      });
      const items = tweetWithReplies?.replies || [];

      let nextCursor: number | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop(); //dont return the one extra
        nextCursor = nextItem?.id;
      }
      return { items, nextCursor };
    }),
});
