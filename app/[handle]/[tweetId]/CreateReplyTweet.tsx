"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { DividerFull } from "src/ui/Divider";
import { trpc } from "src/utils/trpc";
import { useDialogContext } from "src/contexts/Dialog";

type Props = {
  tweetId: number;
  className?: string;
};

export function CreateReplyTweet({ tweetId, className = "" }: Props) {
  const { setShowSignIn } = useDialogContext();
  const utils = trpc.useContext();
  const [text, setText] = useState("");
  const { data: session } = useSession();
  const [showInfoText, setShowInfoText] = useState(false);
  const userExists = !!session?.user;
  const { data: myHandle } = trpc.user.myHandle.useQuery(undefined, {
    enabled: userExists,
  });
  const { mutateAsync: create, isLoading } = trpc.tweet.reply.useMutation({
    onSuccess: () => {
      utils.home.tweets.invalidate();
    },
  });

  const handleClick = async () => {
    if (!userExists) {
      setShowSignIn(true);
      setShowInfoText(true);
    } else {
      await create({ tweetId, text });
      setText("");
    }
  };

  return (
    <div className={`mt-2 flex w-full justify-between ${className}`}>
      {session?.user ? (
        <div className="">
          <Link href={`/${myHandle}`} className="flex w-12 items-center justify-center">
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
            placeholder="Tweet your reply"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        <DividerFull />
        <div className="mt-2 flex items-baseline justify-between">
          <div></div>
          <div className="flex flex-col items-end">
            <button
              disabled={isLoading || !text}
              className="rounded-full bg-sky-500 px-3 py-2 font-bold text-white disabled:bg-sky-300"
              onClick={handleClick}
            >
              Tweet
            </button>
            {showInfoText && !userExists && (
              <div className="rounded-full font-bold text-orange-500">need to sign in first</div>
            )}
          </div>
        </div>
      </div>
      <DividerFull />
    </div>
  );
}
