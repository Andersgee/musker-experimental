import { router } from "../trpc";
import { handleRouter } from "./handle";
import { userRouter } from "./user";
import { home } from "./home";
import { profile } from "./profile";
import { explore } from "./explore";
import { replies } from "./replies";
import { tweet } from "./tweet";
import { follows } from "./follows";

export const appRouter = router({
  user: userRouter,
  handle: handleRouter,
  home,
  profile,
  replies,
  tweet,
  explore,
  follows,
});

// export type definition of API
export type AppRouter = typeof appRouter;
