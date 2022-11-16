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
  tweetAuthor?: string;
};

export function TweetComposeReply({ tweetId, tweetAuthor, className = "" }: Props) {
  const utils = trpc.useContext();
  //const router = useRouter();
  const [text, setText] = useState("");
  const session = useSession();
  const { data: myHandle } = trpc.user.myHandle.useQuery();
  const tweetCreate = trpc.tweet.createReply.useMutation({
    onSuccess: () => {
      utils.tweet.replies.invalidate({ tweetId });
    },
  });

  if (!session.data?.user) {
    return <div>sign in to reply</div>;
  }

  return (
    <div className={`mt-2 flex w-full justify-between ${className}`}>
      <div className="">
        <Link href={`/u/${myHandle}`} className="w-12">
          <img
            className="h-8 w-8 rounded-full shadow-imageborder"
            src={session.data.user.image || undefined}
            alt={myHandle || session.data.user.name || undefined}
          />
        </Link>
      </div>

      <div className="ml-4 flex-1">
        <p>(Replying to {tweetAuthor})</p>
        <div className="flex items-center">
          <textarea
            autoFocus={true}
            className="h-20 w-full p-1"
            aria-label="compose"
            placeholder="Tweet your reply"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        <DividerFull />
        <div className="mt-2 flex items-baseline justify-between ">
          <div>tweet options here</div>
          <button
            disabled={tweetCreate.isLoading || !session.data?.user || !text}
            className="rounded-full bg-sky-500 px-3 py-2 font-bold text-white disabled:bg-sky-300"
            onClick={async () => {
              try {
                await tweetCreate.mutateAsync({ parentTweetId: tweetId, text });
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
