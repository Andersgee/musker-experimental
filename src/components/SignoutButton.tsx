"use client";

import { signOut, useSession } from "next-auth/react";
import { Button } from "src/ui/Button";

type Props = {
  className?: string;
};

export function SignoutButton({ className = "" }: Props) {
  const { data: session } = useSession();
  if (!session?.user) {
    return null;
  }
  return (
    <Button className={`bg-red-500 ${className}`} onClick={() => signOut({ callbackUrl: "/explore" })}>
      sign out
    </Button>
  );
}
