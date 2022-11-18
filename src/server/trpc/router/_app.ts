import { router } from "../trpc";
import { handleRouter } from "./handle";
import { userRouter } from "./user";
import { home } from "./home";
import { profile } from "./profile";
import { explore } from "./explore";
import { replies } from "./replies";
import { tweet } from "./tweet";

export const appRouter = router({
  user: userRouter,
  handle: handleRouter,
  home,
  profile,
  replies,
  tweet,
  explore,
});

// export type definition of API
export type AppRouter = typeof appRouter;
