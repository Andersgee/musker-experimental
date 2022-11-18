"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { DividerFull } from "src/ui/Divider";
import { trpc } from "src/utils/trpc";
import { SigninButtons } from "src/components/SigninButtons";

type Props = {
  className?: string;
};

export function CreateTweet({ className = "" }: Props) {
  const utils = trpc.useContext();
  const [text, setText] = useState("");
  const session = useSession();
  const { data: myHandle } = trpc.user.myHandle.useQuery();
  const { mutateAsync: create, isLoading } = trpc.tweet.create.useMutation({
    onSuccess: () => {
      utils.home.tweets.invalidate();
    },
  });

  if (!session.data?.user) {
    return (
      <div>
        <TweetComposeNotSignedIn />
        <SigninButtons />
      </div>
    );
  }
  return (
    <div className={`mt-2 flex w-full justify-between ${className}`}>
      <div className="">
        <Link href={`/${myHandle}`} className="flex w-12 items-center justify-center">
          <img
            className="h-8 w-8 rounded-full shadow-imageborder"
            src={session.data.user.image || undefined}
            alt={myHandle || session.data.user.name || undefined}
          />
        </Link>
      </div>

      <div className="flex-1">
        <div className="flex items-center">
          <textarea
            className="h-20 w-full p-1"
            aria-label="compose"
            placeholder="Whats's happening?"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        <DividerFull />
        <div className="mt-2 flex items-baseline justify-between">
          <div>tweet options here</div>
          <button
            disabled={isLoading || !session.data?.user || !text}
            className="rounded-full bg-sky-500 px-3 py-2 font-bold text-white disabled:bg-sky-300"
            onClick={async () => {
              try {
                await create({ text });
                setText("");
              } catch (error) {}
            }}
          >
            Tweet
          </button>
        </div>
      </div>
      <DividerFull />
    </div>
  );
}

/**
 * basically copy paste of the above but with everyting disabled
 */
function TweetComposeNotSignedIn() {
  return (
    <div className="mt-2 flex w-full justify-between">
      <div className="">
        <div className="flex w-12 items-center justify-center">
          <div className="h-8 w-8 rounded-full shadow-imageborder" />
        </div>
      </div>

      <div className="flex-1">
        <div className="flex items-center">
          <textarea
            disabled={true}
            className="h-20 w-full p-1"
            aria-label="compose"
            placeholder="Whats's happening? (need to sign in)"
          />
        </div>

        <DividerFull />
        <div className="flex items-baseline justify-between">
          <div>tweet options here</div>
          <button
            disabled={true}
            className="rounded-full bg-sky-500 px-3 py-2 font-bold text-white disabled:bg-sky-300"
          >
            Tweet
          </button>
        </div>
      </div>
    </div>
  );
}
