"use client";

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
    <article className={`flex ${className}`}>
      <div className="mt-4">
        <ImgUser
          className=""
          href={`/u/${tweet.author.handle?.text}`}
          image={tweet.author.image || ""}
          alt={tweet.author.handle?.text || ""}
        />
      </div>
      <Link
        className="flex-1 py-4 hover:bg-neutral-100 dark:hover:bg-neutral-800"
        href={`/u/${tweet.author.handle?.text}/${tweet.id}`}
      >
        <div>{`${tweet.author.handle?.text} - ${formatCreatedAt(tweet.createdAt)}`}</div>
        <pre className="whitespace-pre-wrap">{tweet.text}</pre>
      </Link>
    </article>
  );
}
