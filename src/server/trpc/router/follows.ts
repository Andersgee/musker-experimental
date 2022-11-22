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
      const userId = input.userId;
      const limit = 10;

      const user = await ctx.prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          recievedFollows: {
            orderBy: { createdAt: "desc" },
            take: limit + 1,
            cursor: input.cursor
              ? {
                  userId_followerId: {
                    userId: userId,
                    followerId: input.cursor,
                  },
                }
              : undefined,
            include: {
              follower: true,
            },
          },
        },
      });

      const items = user?.recievedFollows || [];

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
      const userId = input.userId;
      const limit = 10;

      const user = await ctx.prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          sentFollows: {
            orderBy: { createdAt: "desc" },
            take: limit + 1,
            cursor: input.cursor
              ? {
                  userId_followerId: {
                    userId: input.cursor,
                    followerId: userId,
                  },
                }
              : undefined,
            include: {
              user: true,
            },
          },
        },
      });

      const items = user?.sentFollows || [];

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
          //is following userId
          sentFollows: {
            some: {
              userId: input.userId,
            },
          },
          //is followed by me
          recievedFollows: {
            some: {
              followerId: ctx.session.user.id,
            },
          },
        },
        cursor: input.cursor ? { id: input.cursor } : undefined,
        take: limit + 1, //get one extra (use it for cursor to next query)
        select: {
          id: true,
          image: true,
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
