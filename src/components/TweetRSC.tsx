import Link from "next/link";
import { formatCreatedAt } from "src/utils/date";
import { type RouterTypes } from "src/utils/trpc";
import { TweetActions } from "./TweetActions";

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

//type Tweet = Omit<RouterTypes["tweet"]["homeFeed"]["output"]["items"][number], "parentTweet">;
type TweetItem = RouterTypes["tweet"]["homeFeed"]["output"]["items"][number];

type Tweet = Optional<TweetItem, "parentTweet">;

type Props = {
  className?: string;
  tweet: Tweet;
  showReplyLine?: boolean;
};

export function TweetRSC({ tweet, showReplyLine = false, className = "" }: Props) {
  return (
    <article className={`flex ${className}`}>
      <div className="mt-2 flex flex-col">
        <Link href={`/u/${tweet.author.handle?.text}`} className="w-12">
          <img
            className="h-8 w-8 rounded-full shadow-imageborder"
            src={tweet.author.image || ""}
            alt={tweet.author.handle?.text}
          />
        </Link>
        <div className="mt-2 flex-1">{showReplyLine && <div className="ml-3.5 h-full border-l-2 "></div>}</div>
      </div>
      <div>
        <div className="py-2 pl-2">
          <div className="">{`${tweet.author.handle?.text} - ${formatCreatedAt(tweet.createdAt)}`}</div>
          <p>{tweet.text}</p>
        </div>
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
