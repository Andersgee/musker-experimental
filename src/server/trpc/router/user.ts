import { z } from "zod";

import { router, protectedProcedure } from "../trpc";

export const userRouter = router({
  isFollowing: protectedProcedure.input(z.object({ userId: z.string() })).query(async ({ input, ctx }) => {
    const follow = await ctx.prisma.follow.findUnique({
      where: { userId_followerId: { followerId: ctx.session.user.id, userId: input.userId } },
    });
    if (follow) return true;
    return false;
  }),
  follow: protectedProcedure.input(z.object({ userId: z.string() })).mutation(({ input, ctx }) => {
    return ctx.prisma.follow.create({
      data: {
        userId: input.userId,
        followerId: ctx.session.user.id,
      },
    });
  }),
  unfollow: protectedProcedure.input(z.object({ userId: z.string() })).mutation(({ input, ctx }) => {
    return ctx.prisma.follow.delete({
      where: {
        userId_followerId: {
          userId: input.userId,
          followerId: ctx.session.user.id,
        },
      },
    });
  }),
});
