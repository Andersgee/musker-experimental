"use client";

import { trpc } from "src/utils/trpc";
import { TweetCreate } from "src/components/TweetCreate";

type Props = {
  tweetId: number;
  className?: string;
};

export function CreateReplyTweet({ tweetId, className = "" }: Props) {
  const utils = trpc.useContext();

  const { mutateAsync: create, isLoading } = trpc.tweet.reply.useMutation({
    onSuccess: () => {
      utils.replies.tweets.invalidate({ tweetId });
    },
  });

  const onClick = async (text: string) => {
    await create({ tweetId, text });
  };

  return <TweetCreate onClick={onClick} disabled={isLoading} className={className} placeholder="Tweet your reply" />;
}
