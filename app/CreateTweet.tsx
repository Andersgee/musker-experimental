"use client";

import { trpc } from "src/utils/trpc";
import { TweetCreate } from "src/components/TweetCreate";

type Props = {
  className?: string;
};

export function CreateTweet({ className = "" }: Props) {
  const utils = trpc.useContext();

  const { mutateAsync: create, isLoading } = trpc.tweet.create.useMutation({
    onSuccess: () => {
      utils.home.tweets.invalidate();
    },
  });

  const onClick = async (text: string) => {
    await create({ text });
  };

  return <TweetCreate onClick={onClick} disabled={isLoading} placeholder="What's happening?" className={className} />;
}
