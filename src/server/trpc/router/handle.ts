import { z } from "zod";

import { router, protectedProcedure } from "../trpc";

export const handleRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.userHandle.create({
        data: {
          userId: ctx.session.user.id,
          text: input.text,
        },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.userHandle.update({
        where: { userId: ctx.session.user.id },
        data: {
          text: input.text,
        },
      });
    }),
  getMy: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.userHandle.findUnique({
      where: { userId: ctx.session.user.id },
    });
  }),
  getByText: protectedProcedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .query(({ input, ctx }) => {
      return ctx.prisma.userHandle.findUnique({
        where: {
          text: input.text,
        },
      });
    }),
});
