import Link from "next/link";
import { TweetActions } from "src/components/TweetActions";
import { CreatedAtText } from "./CreatedAtText";
import { type Tweet } from "./page";

type Props = {
  tweet: Tweet;
  drawReplyLine?: boolean;
  className?: string;
};

export function TweetRSC({ tweet, drawReplyLine = true, className = "" }: Props) {
  return (
    <article className={`flex ${className}`}>
      <div className="mt-2 flex flex-col">
        <Link href={`/${tweet.author.handle?.text}`} className="w-12">
          <img
            className="h-8 w-8 rounded-full shadow-imageborder"
            src={tweet.author.image || ""}
            alt={tweet.author.handle?.text}
          />
        </Link>
        <div className="mt-2 flex-1">{drawReplyLine && <div className="ml-3.5 h-full border-l-2 "></div>}</div>
      </div>
      <div className="flex-1 py-2 pl-2 ">
        <Link href={`/${tweet.author.handle?.text}/${tweet.id}`}>
          <div className=" hover:bg-neutral-100 dark:hover:bg-neutral-800">
            <h3 className="text-base font-normal">{tweet.author.handle?.text}</h3>
            {tweet.author.handle?.text} - <CreatedAtText createdAtNumber={tweet.createdAt.getTime()} />
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
