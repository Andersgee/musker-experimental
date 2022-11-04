"use client";

import { trpc } from "src/utils/trpc";

type Props = {
  className?: string;
};

export function CreatePost({ className }: Props) {
  const { data: posts } = trpc.post.getAll.useQuery();

  return (
    <div className={className}>
      <div>CreatePost</div>
      <p>posts: {JSON.stringify(posts)}</p>
    </div>
  );
}
