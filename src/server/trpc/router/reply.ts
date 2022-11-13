import { z } from "zod";

import { router, publicProcedure, protectedProcedure } from "../trpc";

export const replyRouter = router({
  getById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(({ input, ctx }) => {
      return ctx.prisma.reply.findUnique({ where: { id: input.id } });
    }),
  create: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
        text: z.string(),
      }),
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.reply.create({
        data: {
          authorId: ctx.session.user.id,
          postId: input.postId,
          text: input.text,
        },
      });
    }),
  postReplies: publicProcedure
    .input(
      z.object({
        cursor: z.string().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const limit = 10;

      const items = await ctx.prisma.reply.findMany({
        cursor: input.cursor ? { id: input.cursor } : undefined,
        take: limit + 1, //get one extra (use it for cursor to next query)
        orderBy: { createdAt: "desc" },
        include: { author: { include: { handle: true } } },
      });

      let nextCursor: string | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop(); //dont return the one extra
        nextCursor = nextItem?.id;
      }
      return { items, nextCursor };
    }),
});
