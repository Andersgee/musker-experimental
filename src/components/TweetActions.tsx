"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { IconHeart } from "src/icons/Heart";
import { IconReply } from "src/icons/Reply";
import { IconRewteet } from "src/icons/Retweet";
import { trpc } from "src/utils/trpc";

type Props = {
  className?: string;
  tweetId: string;
  authorHandle: string;
  likes: number;
  replies: number;
  retweets: number;
};

export function TweetActions({ tweetId, authorHandle, likes, replies, retweets, className = "" }: Props) {
  const [replyCount, setReplyCount] = useState(replies);
  const [likeCount, setLikeCount] = useState(likes);
  const [retweetCount, setRetweetCount] = useState(retweets);
  const { data: session } = useSession();

  const utils = trpc.useContext();
  const { data: existingLike } = trpc.tweet.existingLike.useQuery({ tweetId }, { enabled: !!session?.user });
  const { mutateAsync: like } = trpc.tweet.like.useMutation();
  const { mutateAsync: unlike } = trpc.tweet.unlike.useMutation();

  const { data: existingRetweet } = trpc.tweet.existingRetweet.useQuery({ tweetId }, { enabled: !!session?.user });
  const { mutateAsync: retweet } = trpc.tweet.retweet.useMutation();
  const { mutateAsync: unretweet } = trpc.tweet.unretweet.useMutation();

  const handleLikeClick = async () => {
    if (existingLike) {
      await unlike({ tweetId });
      setLikeCount((prev) => prev - 1);
    } else {
      await like({ tweetId });
      setLikeCount((prev) => prev + 1);
    }
    utils.tweet.existingLike.invalidate({ tweetId });
  };

  const handleRetweetClick = async () => {
    if (existingRetweet) {
      await unretweet({ tweetId });
      setRetweetCount((prev) => prev - 1);
    } else {
      await retweet({ tweetId, text: "" });
      setRetweetCount((prev) => prev + 1);
    }
    utils.tweet.existingRetweet.invalidate({ tweetId });
  };

  return (
    <div className={`flex w-full gap-4 ${className}`}>
      <Link title="Reply" className="group flex w-20 pt-1" href={`/${authorHandle}/${tweetId}`}>
        <IconReply className="mr-2 h-6 w-6 group-hover:text-blue-500" /> {replyCount}
      </Link>
      <button className="group flex w-20" title="Retweet" onClick={handleRetweetClick}>
        <IconRewteet
          className={`mr-2 h-6 w-6 ${existingRetweet ? "text-fuchsia-600" : "group-hover:text-fuchsia-300"}`}
        />
        {retweetCount}
      </button>
      <button className="group flex w-20" title="Like" onClick={handleLikeClick}>
        <IconHeart className={`mr-2 h-6 w-6 ${existingLike ? "text-pink-600" : "group-hover:text-pink-300"}`} />
        {likeCount}
      </button>
    </div>
  );
}
