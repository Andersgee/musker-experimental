"use client";

import Link from "next/link";
import { formatCreatedAt } from "src/utils/date";
import { type RouterTypes, trpc } from "src/utils/trpc";
import { TweetActions } from "./TweetActions";

//type Tweet = Omit<RouterTypes["tweet"]["homeFeed"]["output"]["items"][number], "parentTweet">;
//type Tweet = RouterTypes["tweet"]["homeFeed"]["output"]["items"][number];
type Tweet = RouterTypes["home"]["tweets"]["output"]["items"][number];

type Props = {
  className?: string;
  tweet: Tweet;
};

export function Tweet({ tweet, className = "" }: Props) {
  return (
    <article className={`flex ${className}`}>
      <div className="mt-2">
        <a href={`/${tweet.author.handle?.text}`} className="w-12">
          <img
            className="h-8 w-8 rounded-full shadow-imageborder"
            src={tweet.author.image || ""}
            alt={tweet.author.handle?.text}
          />
        </a>
      </div>
      <div className="flex-1">
        <Link href={`/${tweet.author.handle?.text}/${tweet.id}`}>
          <div className="py-2 pl-2 hover:bg-neutral-100 dark:hover:bg-neutral-800">
            <h3 className="text-base font-normal">
              {`${tweet.author.handle?.text} - ${formatCreatedAt(tweet.createdAt)}`}{" "}
              <span className=" text-neutral-500">
                {tweet.parentTweet?.author && `(Replying to ${tweet.parentTweet.author.handle?.text})`}
              </span>
            </h3>
            <p>{tweet.text}</p>
          </div>
        </Link>
        <TweetActions
          tweetId={tweet.id}
          authorHandle={tweet.author.handle?.text || ""}
          likes={tweet._count.tweetLikes}
          replies={tweet._count.childTweets}
          retweets={tweet._count.retweets}
        />
      </div>
    </article>
  );
}
