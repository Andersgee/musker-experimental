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
      const userId = input.userId;
      const limit = 10;

      const myUser = await ctx.prisma.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
        select: {
          sentFollows: {
            select: {
              userId: true,
            },
          },
        },
      });
      const myFollowedIds = myUser?.sentFollows.map((follow) => follow.userId) || [];

      const user = await ctx.prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          recievedFollows: {
            where: {
              followerId: {
                in: myFollowedIds,
              },
            },
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
});
