"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
//import { useRouter } from "next/navigation";
import { useState } from "react";
import { DividerFull } from "src/ui/Divider";
import { trpc } from "src/utils/trpc";

type Props = {
  className?: string;
  tweetId: string;
};

export function TweetComposeReply({ tweetId, className = "" }: Props) {
  const utils = trpc.useContext();
  //const router = useRouter();
  const [text, setText] = useState("");
  const session = useSession();
  const tweetCreate = trpc.tweet.createReply.useMutation({
    onSuccess: () => utils.tweet.invalidate(),
  });

  if (!session.data?.user) {
    return <div>sign in to reply</div>;
  }

  return (
    <div className="flex w-full justify-between">
      <div className="">
        <Link href={`/u/${session.data.user.handle}`} className="w-12">
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
            placeholder="Tweet your reply"
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
                await tweetCreate.mutateAsync({ tweetId, text });
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
