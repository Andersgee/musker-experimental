import { router } from "../trpc";
import { authRouter } from "./auth";
import { handleRouter } from "./handle";
import { tweetRouter } from "./tweet";
import { tweetLikeRouter } from "./tweetLike";
import { userRouter } from "./user";
import { activityRouter } from "./activity";

export const appRouter = router({
  user: userRouter,
  tweet: tweetRouter,
  tweetLike: tweetLikeRouter,
  auth: authRouter,
  handle: handleRouter,
  activity: activityRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
