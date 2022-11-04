"use client";

import { SessionProvider as NextauthSessionProvider } from "next-auth/react";

type Props = {
  children: React.ReactNode;
};

export function SessionProvider({ children }: Props) {
  return <NextauthSessionProvider>{children}</NextauthSessionProvider>;
}
