"use client";

import Link from "next/link";
import { formatCreatedAt } from "src/utils/date";
import { hashidFromNumber } from "src/utils/hashids";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useDialogContext } from "src/contexts/Dialog";
import { IconHeart } from "src/icons/Heart";
import { IconReply } from "src/icons/Reply";
import { IconRewteet } from "src/icons/Retweet";
import { trpc } from "src/utils/trpc";

type Props = {
  tweetId: number;
  handle: string;
  image: string;
  createdAt: Date;
  text: string;
  className?: string;
  likes: number;
  replies: number;
  retweets: number;
};

export function TweetBody({
  tweetId,
  handle,
  image,
  text,
  createdAt,
  likes,
  replies,
  retweets,
  className = "",
}: Props) {
  return (
    <article className={`flex ${className}`}>
      <div className="">
        <a href={`/${handle}`} className="w-12">
          <img className="h-8 w-8 rounded-full shadow-imageborder" src={image} alt={handle} />
        </a>
      </div>
      <div className="flex-1 py-2 pl-2 ">
        <Link href={`/${handle}/${hashidFromNumber(tweetId)}`}>
          <div className=" hover:bg-neutral-100 dark:hover:bg-neutral-800">
            <h3 className="text-base font-normal">
              {handle} - {formatCreatedAt(createdAt)}
            </h3>
            <p>{text}</p>
          </div>
        </Link>
        <Actions tweetId={tweetId} authorHandle={handle} likes={likes} replies={replies} retweets={retweets} />
      </div>
    </article>
  );
}

type ActionsProps = {
  className?: string;
  tweetId: number;
  authorHandle: string;
  likes: number;
  replies: number;
  retweets: number;
};

export function Actions({ tweetId, authorHandle, likes, replies, retweets, className = "" }: ActionsProps) {
  const { setShowSignIn } = useDialogContext();
  //const [replyCount, setReplyCount] = useState(replies);
  const replyCount = replies;
  const [likeCount, setLikeCount] = useState(likes);
  const [retweetCount, setRetweetCount] = useState(retweets);
  const { data: session } = useSession();
  const userExists = !!session?.user;

  const utils = trpc.useContext();
  const { data: existingLike } = trpc.tweet.existingLike.useQuery(
    { tweetId },
    {
      enabled: userExists,
    },
  );
  const { mutateAsync: like } = trpc.tweet.like.useMutation();
  const { mutateAsync: unlike } = trpc.tweet.unlike.useMutation();

  const { data: existingRetweet } = trpc.tweet.existingRetweet.useQuery(
    {
      tweetId,
    },
    { enabled: userExists },
  );
  const { mutateAsync: retweet } = trpc.tweet.retweet.useMutation();
  const { mutateAsync: unretweet } = trpc.tweet.unretweet.useMutation();

  const handleLikeClick = async () => {
    if (!userExists) {
      setShowSignIn(true);
      return;
    }

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
    if (!userExists) {
      setShowSignIn(true);
      return;
    }

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
      <Link title="Reply" className="group flex w-20 pt-1" href={`/${authorHandle}/${hashidFromNumber(tweetId)}`}>
        <IconReply className="mr-2 h-6 w-6 group-hover:text-blue-500" /> {replyCount}
      </Link>
      <button className="group flex w-20" title="Retweet" onClick={handleRetweetClick}>
        <IconRewteet
          className={`mr-2 h-6 w-6 ${existingRetweet ? "text-emerald-600" : "group-hover:text-emerald-300"}`}
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

type LikesProps = {
  likes?: {
    user: {
      handle: {
        text: string;
      } | null;
    };
    userId: string;
  }[];

  className?: string;
};

export function Likes({ likes, className = "" }: LikesProps) {
  if (!likes || likes.length < 1) {
    return null;
  }

  return (
    <div className="flex font-paragraph text-sm">
      <div className="flex w-10 justify-end">
        <IconHeart className="mr-2 w-4" />
      </div>
      {likes.map((like) => (
        <Link key={like.userId} href={`/${like.user.handle?.text}`} className="mr-1 hover:underline">
          {like.user.handle?.text}
        </Link>
      ))}
      <div>liked</div>
    </div>
  );
}
