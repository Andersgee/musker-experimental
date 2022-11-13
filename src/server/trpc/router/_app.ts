import { router } from "../trpc";
import { authRouter } from "./auth";
import { handleRouter } from "./handle";
import { tweetRouter } from "./tweet";
import { userRouter } from "./user";

export const appRouter = router({
  user: userRouter,
  tweet: tweetRouter,
  auth: authRouter,
  handle: handleRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
