"use client";

import Link from "next/link";
import { ImgUser } from "src/ui/ImgUser";
import { formatPostCreatedAt } from "src/utils/date";
import type { RouterTypes } from "src/utils/trpc";

type Props = {
  className?: string;
  reply: RouterTypes["reply"]["postReplies"]["output"]["items"][number];
};

export function Reply({ reply, className }: Props) {
  return (
    <article className="flex">
      <div className="mt-4">
        <ImgUser
          className=""
          href={`/u/${reply.author.handle?.text}`}
          image={reply.author.image || ""}
          alt={reply.author.handle?.text || ""}
        />
      </div>
      <Link
        className="flex-1 py-4 hover:bg-neutral-100 dark:hover:bg-neutral-800"
        href={`/u/${reply.author.handle?.text}/p/${reply.id}`}
      >
        <div>{`${reply.author.handle?.text} - ${formatPostCreatedAt(reply.createdAt)}`}</div>
        <pre className="whitespace-pre-wrap">{reply.text}</pre>
      </Link>
    </article>
  );
}
