"use client";

import Link from "next/link";
import { ImgUser } from "src/ui/ImgUser";
import { formatCreatedAt } from "src/utils/date";
import type { RouterTypes } from "src/utils/trpc";

type Props = {
  className?: string;
  post: RouterTypes["tweet"]["homeFeed"]["output"]["items"][number];
};

export function Post({ post, className }: Props) {
  return (
    <article className="flex">
      <div className="mt-4">
        <ImgUser
          className=""
          href={`/u/${post.author.handle?.text}`}
          image={post.author.image || ""}
          alt={post.author.handle?.text || ""}
        />
      </div>
      <Link
        className="flex-1 py-4 hover:bg-neutral-100 dark:hover:bg-neutral-800"
        href={`/u/${post.author.handle?.text}/p/${post.id}`}
      >
        <div>{`${post.author.handle?.text} - ${formatCreatedAt(post.createdAt)}`}</div>
        <pre className="whitespace-pre-wrap">{post.text}</pre>
      </Link>
    </article>
  );
}
