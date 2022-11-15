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
  const { data: existingLike } = trpc.tweetLike.getById.useQuery({ tweetId }, { enabled: !!session?.user });
  const { mutateAsync: like } = trpc.tweetLike.like.useMutation();
  const { mutateAsync: unlike } = trpc.tweetLike.unlike.useMutation();

  const handleHeartClick = async () => {
    if (existingLike) {
      await unlike({ tweetId });
      setLikeCount((prev) => prev - 1);
    } else {
      await like({ tweetId });
      setLikeCount((prev) => prev + 1);
    }
    utils.tweetLike.getById.invalidate({ tweetId });
  };

  return (
    <div className={`flex w-full gap-4 ${className}`}>
      <Link className="group flex w-20 pt-1" href={`/u/${authorHandle}/${tweetId}`}>
        <IconReply className="mr-2 h-6 w-6 group-hover:text-blue-500" /> {replyCount}
      </Link>
      <button className="group flex w-20">
        <IconRewteet className="mr-2 h-6 w-6 group-hover:text-blue-500" /> {retweetCount}
      </button>
      <button className="group flex w-20" title="Like" onClick={handleHeartClick}>
        <IconHeart className={`mr-2 h-6 w-6 ${existingLike ? "text-pink-600" : "group-hover:text-pink-300"}`} />
        {likeCount}
      </button>
    </div>
  );
}
