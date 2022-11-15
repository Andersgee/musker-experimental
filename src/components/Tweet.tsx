"use client";

import Link from "next/link";
import { formatCreatedAt } from "src/utils/date";
import { type RouterTypes, trpc } from "src/utils/trpc";
import { TweetActions } from "./TweetActions";

type Tweet = Omit<RouterTypes["tweet"]["homeFeed"]["output"]["items"][number], "parentTweet">;

type Props = {
  className?: string;
  tweet: Tweet;
};

export function Tweet({ tweet, className = "" }: Props) {
  return (
    <article className={`flex ${className}`}>
      <div className="mt-2">
        <a href={`/u/${tweet.author.handle?.text}`} className="w-12">
          <img
            className="h-8 w-8 rounded-full shadow-imageborder"
            src={tweet.author.image || ""}
            alt={tweet.author.handle?.text}
          />
        </a>
      </div>
      <div className="flex-1">
        <Link href={`/u/${tweet.author.handle?.text}/${tweet.id}`}>
          <div className="py-2 pl-2 hover:bg-neutral-100 dark:hover:bg-neutral-800">
            <div className="">{`${tweet.author.handle?.text} - ${formatCreatedAt(tweet.createdAt)}`}</div>
            <p>{tweet.text}</p>
          </div>
        </Link>
        <TweetActions
          tweetId={tweet.id}
          authorHandle={tweet.author.handle?.text || ""}
          likes={tweet._count.tweetLikes}
          replies={tweet._count.childTweets}
        />
      </div>
    </article>
  );
}
