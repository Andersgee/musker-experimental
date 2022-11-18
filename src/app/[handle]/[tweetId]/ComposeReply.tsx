"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { DividerFull } from "src/ui/Divider";
import { trpc } from "src/utils/trpc";

type Props = {
  className?: string;
  tweetId: number;
};

export function ComposeReply({ tweetId, className = "" }: Props) {
  const utils = trpc.useContext();
  //const router = useRouter();
  const [text, setText] = useState("");
  const { data: session } = useSession();
  const { data: myHandle } = trpc.user.myHandle.useQuery(undefined, { enabled: !!session?.user });
  const { mutateAsync: reply, isLoading } = trpc.tweet.reply.useMutation({
    onSuccess: () => {
      utils.replies.tweets.invalidate({ tweetId });
    },
  });

  if (!session?.user) {
    return <div>sign in to reply</div>;
  }

  return (
    <div className={`mt-2 flex w-full justify-between ${className}`}>
      <div className="">
        <Link href={`/${myHandle}`} className="w-12">
          <img
            className="h-8 w-8 rounded-full shadow-imageborder"
            src={session.user.image || undefined}
            alt={myHandle || undefined}
          />
        </Link>
      </div>

      <div className="ml-4 flex-1">
        <div className="flex items-center">
          <textarea
            //autoFocus={true}
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
            disabled={isLoading || !text}
            className="rounded-full bg-sky-500 px-3 py-2 font-bold text-white disabled:bg-sky-300"
            onClick={async () => {
              try {
                await reply({ tweetId, text });
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