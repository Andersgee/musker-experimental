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

      const items = await ctx.prisma.tweet.findMany({
        orderBy: { createdAt: "desc" },
        where: { repliedToTweetId: input.tweetId },
        cursor: input.cursor ? { id: input.cursor } : undefined,
        take: limit + 1, //get one extra (use it for cursor to next query)
        include: {
          _count: {
            select: { replies: true, retweets: true, likes: true },
          },
          author: true,
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
