"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { useDialogContext } from "src/contexts/Dialog";
import { DividerFull } from "src/ui/Divider";
import { trpc } from "src/utils/trpc";
import { UserHandleChoose } from "./UserHandleChoose";

type Props = {
  className?: string;
  onClick: (text: string) => Promise<void>;
  disabled: boolean;
  placeholder: string;
};

export function TweetCreate({ onClick, disabled, placeholder, className = "" }: Props) {
  const { data: session } = useSession();
  const userExists = !!session?.user;
  const { data: myHandle } = trpc.user.myHandle.useQuery(undefined, {
    enabled: userExists,
  });
  const { setShowSignIn } = useDialogContext();
  const [showInfoText, setShowInfoText] = useState(false);
  const [showHandlePicker, setShowHandlePicker] = useState(false);
  const [text, setText] = useState("");

  const handleClick = async () => {
    if (!userExists) {
      setShowSignIn(true);
      setShowInfoText(true);
    } else if (!myHandle) {
      setShowHandlePicker(true);
      return;
    } else {
      await onClick(text);
      setText("");
    }
  };

  return (
    <div className={` ${className}`}>
      <div className={`mt-2 flex w-full justify-between ${className}`}>
        {session?.user ? (
          <div className="">
            <Link href={`/${myHandle || ""}`} className="flex w-12 items-center justify-center">
              <img
                className="h-8 w-8 rounded-full shadow-imageborder"
                src={session.user?.image || undefined}
                alt={myHandle || undefined}
              />
            </Link>
          </div>
        ) : (
          <div className="w-12"></div>
        )}

        <div className="flex-1">
          <div className="flex items-center">
            <textarea
              className="h-20 w-full p-1"
              aria-label="compose"
              placeholder={placeholder}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>

          <DividerFull />
          <div className="mt-2 flex items-baseline justify-between">
            <div></div>
            <div className="flex flex-col items-end">
              <button
                disabled={disabled || !text}
                className="rounded-full bg-sky-500 px-3 py-2 font-bold text-white disabled:bg-sky-300"
                onClick={handleClick}
              >
                Tweet
              </button>
              {!userExists && showInfoText && (
                <div className="rounded-full font-bold text-orange-500">need to sign in first</div>
              )}
              {!myHandle && showHandlePicker && <UserHandleChoose />}
            </div>
          </div>
        </div>
        <DividerFull />
      </div>
    </div>
  );
}
