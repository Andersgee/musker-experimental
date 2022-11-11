import { router } from "../trpc";
import { authRouter } from "./auth";
import { handleRouter } from "./handle";
import { postRouter } from "./post";
import { userRouter } from "./user";

export const appRouter = router({
  user: userRouter,
  post: postRouter,
  auth: authRouter,
  handle: handleRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
