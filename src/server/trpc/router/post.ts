import { z } from "zod";

import { router, publicProcedure, protectedProcedure } from "../trpc";

export const postRouter = router({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.post.findMany({
      include: {
        author: {
          select: {
            name: true,
            handle: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }),
  getById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(({ input, ctx }) => {
      return ctx.prisma.post.findUnique({ where: { id: input.id } });
    }),
  create: protectedProcedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.post.create({
        data: {
          authorId: ctx.session.user.id,
          text: input.text,
        },
      });
    }),
});
