"use client";

import { signIn, signOut, useSession } from "next-auth/react";

type Props = {
  className?: string;
};

export function SigninButtons({ className }: Props) {
  const { data: sessionData } = useSession();

  return (
    <div className={className}>
      <div>sessionData?.user?.name: {JSON.stringify(sessionData?.user?.name)}</div>
      <button className="bg-green-300 px-3 py-2" onClick={() => signIn()}>
        sign in{" "}
      </button>
      <button className="bg-red-300 px-3 py-2" onClick={() => signOut()}>
        sign out{" "}
      </button>
    </div>
  );
}
