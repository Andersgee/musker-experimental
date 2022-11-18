"use client";

import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import { useDialogContext } from "src/contexts/Dialog";
import { useOnClickOutside } from "src/hooks/useOnClickOutside";
import { SigninButtons } from "./SigninButtons";

export function SignInDialog() {
  const { showSignIn, setShowSignIn } = useDialogContext();
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, () => setShowSignIn(false));

  const { data: session } = useSession();
  useEffect(() => {
    if (showSignIn && session?.user) {
      setShowSignIn(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, showSignIn]);

  if (showSignIn && !session?.user) {
    return (
      <div ref={ref} className="absolute top-0 right-0 z-10 border-2 bg-neutral-50 shadow-md ">
        <SigninButtons />
      </div>
    );
  }

  return null;
}
