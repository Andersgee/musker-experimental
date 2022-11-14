"use client";

import Link from "next/link";
import { IconHeart } from "src/icons/Heart";
import { IconReply } from "src/icons/Reply";
import { IconRewteet } from "src/icons/Retweet";
import { formatCreatedAt } from "src/utils/date";
import type { RouterTypes } from "src/utils/trpc";

type Tweet = Omit<RouterTypes["tweet"]["homeFeed"]["output"]["items"][number], "parentTweet">;

type Props = {
  className?: string;
  tweet: Tweet;
};

export function Tweet({ tweet: tweet, className = "" }: Props) {
  const replyCount = tweet._count.childTweets;

  return (
    <article className={` flex ${className}`}>
      <div className="mt-2">
        <Link href={`/u/${tweet.author.handle?.text}`} className="w-12">
          <img
            className="h-8 w-8 rounded-full shadow-imageborder"
            src={tweet.author.image || ""}
            alt={tweet.author.handle?.text}
          />
        </Link>
      </div>
      <div className="flex-1">
        <Link href={`/u/${tweet.author.handle?.text}/${tweet.id}`}>
          <div className="py-2 pl-2 hover:bg-neutral-100 dark:hover:bg-neutral-800">
            <div className="">{`${tweet.author.handle?.text} - ${formatCreatedAt(tweet.createdAt)}`}</div>
            <p>{tweet.text}</p>
          </div>
        </Link>
        <div className="flex w-full gap-4">
          <button className="group flex w-20 pt-1">
            <IconReply className="mr-2 h-6 w-6 group-hover:text-blue-500" /> {replyCount}
          </button>
          <button className="group flex w-20">
            <IconRewteet className="mr-2 h-6 w-6 group-hover:text-blue-500" /> {replyCount}
          </button>
          <button className="group flex w-20">
            <IconHeart className="mr-2 h-6 w-6 group-hover:text-blue-500" /> {replyCount}
          </button>
        </div>
      </div>
    </article>
  );
}