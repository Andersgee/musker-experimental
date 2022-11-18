import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";
//import { type Prisma } from "@prisma/client";

export const follows = router({
  followers: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        cursor: z.string().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const limit = 10;

      const items = await ctx.prisma.follow.findMany({
        orderBy: { createdAt: "desc" },
        where: { userId: input.userId },
        cursor: input.cursor
          ? {
              userId_followerId: {
                userId: input.userId,
                followerId: input.cursor,
              },
            }
          : undefined,
        take: limit + 1, //get one extra (use it for cursor to next query)
        select: {
          followerId: true,
          follower: {
            select: {
              image: true,
              handle: {
                select: {
                  text: true,
                },
              },
            },
          },
        },
      });

      let nextCursor: string | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop(); //dont return the one extra
        nextCursor = nextItem?.followerId;
      }
      return { items, nextCursor };
    }),

  following: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        cursor: z.string().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const limit = 10;

      const items = await ctx.prisma.follow.findMany({
        orderBy: { createdAt: "desc" },
        where: { followerId: input.userId },
        cursor: input.cursor
          ? {
              userId_followerId: {
                userId: input.cursor,
                followerId: input.userId,
              },
            }
          : undefined,
        take: limit + 1, //get one extra (use it for cursor to next query)
        select: {
          userId: true,
          user: {
            select: {
              image: true,
              handle: {
                select: {
                  text: true,
                },
              },
            },
          },
        },
      });

      let nextCursor: string | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop(); //dont return the one extra
        nextCursor = nextItem?.userId;
      }
      return { items, nextCursor };
    }),
  /** the followers of userId that I know of (which is the ones I myself follow) */
  knownFollowers: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        cursor: z.string().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const limit = 10;

      const items = await ctx.prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        where: {
          AND: [
            //follows userId
            {
              sentFollows: {
                some: {
                  userId: input.userId,
                },
              },
            },
            //I follow
            {
              recievedFollows: {
                some: {
                  userId: ctx.session.user.id,
                },
              },
            },
          ],
        },
        cursor: input.cursor ? { id: input.cursor } : undefined,
        take: limit + 1, //get one extra (use it for cursor to next query)
        select: {
          id: true,
          handle: true,
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
