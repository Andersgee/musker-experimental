"use client";

import { signOut, useSession } from "next-auth/react";
import { Button } from "src/ui/Button";

type Props = {
  className?: string;
};

export function SignoutButton({ className = "" }: Props) {
  const session = useSession();
  if (!session.data?.user) {
    return null;
  }
  return (
    <Button className={`bg-red-500 ${className}`} onClick={() => signOut()}>
      sign out
    </Button>
  );
}
