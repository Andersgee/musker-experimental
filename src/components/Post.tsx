"use client";

import { ImgUser } from "src/ui/ImgUser";
import { formatPostCreatedAt } from "src/utils/date";
import type { RouterTypes } from "src/utils/trpc";

type Props = {
  className?: string;
  post: RouterTypes["post"]["homeFeed"]["output"]["items"][number];
};

export function Post({ post, className }: Props) {
  return (
    <article className="flex">
      <div>
        <ImgUser
          href={`/u/${post.author.handle?.text}`}
          image={post.author.image || ""}
          alt={post.author.handle?.text || ""}
        />
      </div>
      <div>
        <div>{`${post.author.handle?.text} - ${formatPostCreatedAt(post.createdAt)}`}</div>
        <p>{post.text}</p>
      </div>
    </article>
  );
}
