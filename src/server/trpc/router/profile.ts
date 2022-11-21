import { z } from "zod";
import { router, publicProcedure } from "../trpc";
//import { type Prisma } from "@prisma/client";

export const profile = router({
  tweets: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        cursor: z.number().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const limit = 30;
      const userId = input.userId;

      const items = await ctx.prisma.tweet.findMany({
        orderBy: { createdAt: "desc" },
        cursor: input.cursor ? { id: input.cursor } : undefined,
        take: limit + 1,
        where: {
          authorId: userId, //tweets,retweets and replies are all just regular tweets
        },
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
              authorId: true,
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

      let nextCursor: number | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop(); //dont return the one extra
        nextCursor = nextItem?.id;
      }
      return { items, nextCursor };
    }),
  tweetsWithoutReplies: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        cursor: z.number().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const limit = 30;
      const userId = input.userId;

      const items = await ctx.prisma.tweet.findMany({
        orderBy: { createdAt: "desc" },
        cursor: input.cursor ? { id: input.cursor } : undefined,
        take: limit + 1,
        where: {
          authorId: userId, //tweets,retweets and replies are all just regular tweets
          repliedToTweetId: null, //only include if is not reply
        },
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

      let nextCursor: number | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop(); //dont return the one extra
        nextCursor = nextItem?.id;
      }
      return { items, nextCursor };
    }),
  //twitter does not have the option to only see replies from a user as far as I can see?
  replies: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        cursor: z.number().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const limit = 30;
      const userId = input.userId;

      const items = await ctx.prisma.tweet.findMany({
        orderBy: { createdAt: "desc" },
        cursor: input.cursor ? { id: input.cursor } : undefined,
        take: limit + 1, //get one extra (use it for cursor to next query)
        where: {
          authorId: userId, //tweets,retweets and replies are all just regular tweets
          repliedToTweetId: { not: null }, //require tweet to be reply
        },
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

      let nextCursor: number | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop(); //dont return the one extra
        nextCursor = nextItem?.id;
      }
      return { items, nextCursor };
    }),

  likes: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        cursor: z.number().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const limit = 30;
      const userId = input.userId;

      const items = await ctx.prisma.tweetLike.findMany({
        where: {
          userId: userId,
        },
        orderBy: { createdAt: "desc" },
        cursor: input.cursor
          ? {
              userId_tweetId: {
                userId: userId,
                tweetId: input.cursor,
              },
            }
          : undefined,
        take: limit + 1, //get one extra (use it for cursor to next query)
        include: {
          tweet: {
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
        },
      });

      let nextCursor: number | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop(); //dont return the one extra
        nextCursor = nextItem?.tweetId;
      }
      return { items, nextCursor };
    }),
});
