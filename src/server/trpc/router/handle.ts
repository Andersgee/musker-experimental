import { z } from "zod";

import { router, protectedProcedure } from "../trpc";

export const handleRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        text: z.string().min(3),
      }),
    )
    .mutation(({ input, ctx }) => {
      //create is same as update
      return ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          handle: input.text,
        },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        text: z.string().min(3),
      }),
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          handle: input.text,
        },
      });
    }),
  getMy: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.session.user.id },
      select: {
        handle: true,
      },
    });
    return user?.handle;
  }),
  getByText: protectedProcedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          handle: input.text,
        },
        select: {
          handle: true,
        },
      });
      return user?.handle;
    }),
});
