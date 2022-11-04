import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const postRouter = router({
  hello: publicProcedure.input(z.object({ text: z.string().nullish() }).nullish()).query(({ input }) => {
    return {
      greeting: `Hello ${input?.text ?? "world"}`,
    };
  }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.post.findMany();
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
  create: publicProcedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .mutation(({ input, ctx }) => {
      const andersId = "cla0djpis0000uiloasxp7th7";
      //console.log("post create... ctx?.session?.user", JSON.stringify(ctx?.session?.user));
      //console.log("post create... ctx?.session", JSON.stringify(ctx?.session));
      console.log("hello from mutation");
      return true;
      /*
      return ctx.prisma.post.create({
        data: {
          //authorId: ctx.session.user.id,
          authorId: andersId,
          text: input.text,
        },
      });
      */
    }),
});
