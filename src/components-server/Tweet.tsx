import Link from "next/link";
import { ImgUser } from "src/ui/ImgUser";
import { formatCreatedAt } from "src/utils/date";
import type { RouterTypes } from "src/utils/trpc";

//
type Tweet = Omit<RouterTypes["tweet"]["homeFeed"]["output"]["items"][number], "parentTweet">;

type Props = {
  className?: string;
  tweet: Tweet;
};

export function Tweet({ tweet: tweet, className = "" }: Props) {
  const replyCount = tweet._count.childTweets;
  return (
    <article className="flex">
      <div>
        <ImgUser
          href={`/u/${tweet.author.handle?.text}`}
          image={tweet.author.image || ""}
          alt={tweet.author.handle?.text || ""}
        />
      </div>
      <div>
        <div>{`${tweet.author.handle?.text} - ${formatCreatedAt(tweet.createdAt)}`}</div>
        <p>{tweet.text}</p>
        <div>{replyCount > 0 ? `${replyCount} replies` : ""}</div>
      </div>
    </article>
  );
}
