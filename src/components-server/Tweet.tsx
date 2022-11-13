import Link from "next/link";
import { ImgUser } from "src/ui/ImgUser";
import { formatCreatedAt } from "src/utils/date";
import type { RouterTypes } from "src/utils/trpc";

type Props = {
  className?: string;
  tweet: RouterTypes["tweet"]["homeFeed"]["output"]["items"][number];
};

export function Tweet({ tweet: tweet, className = "" }: Props) {
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
      </div>
    </article>
  );
}
