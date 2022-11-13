"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
//import { useRouter } from "next/navigation";
import { useState } from "react";
import { DividerFull } from "src/ui/Divider";
import { trpc } from "src/utils/trpc";
import { SigninButtons } from "src/components/SigninButtons";

type Props = {
  className?: string;
};

export function TweetCompose({ className = "" }: Props) {
  const utils = trpc.useContext(); //https://trpc.io/docs/v10/useContext#helpers
  //const router = useRouter();
  const [text, setText] = useState("");
  const session = useSession();
  const tweetCreate = trpc.tweet.create.useMutation({
    onSuccess: () => {
      utils.tweet.homeFeed.invalidate();
    },
  });

  if (!session.data?.user) {
    return (
      <div>
        <p>sign in before you can tweet anything</p>
        <SigninButtons />
      </div>
    );
  }
  return (
    <div className="flex w-full justify-between">
      <div className="">
        <Link href={`/u/${session.data.user.handle}`} className="flex w-12 items-center justify-center">
          <img
            className="h-8 w-8 rounded-full shadow-imageborder"
            src={session.data.user.image || undefined}
            alt={session.data.user.handle || session.data.user.name || undefined}
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
        <div className="flex items-baseline justify-between">
          <div>tweet options here</div>
          <button
            disabled={tweetCreate.isLoading || !session.data?.user || !text}
            className="rounded-full bg-sky-500 px-3 py-2 font-bold text-white disabled:bg-sky-300"
            onClick={async () => {
              try {
                await tweetCreate.mutateAsync({ text });
                setText("");
              } catch (error) {}
            }}
          >
            Tweet
          </button>
        </div>
      </div>
    </div>
  );
}
