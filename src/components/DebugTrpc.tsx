"use client";

import { trpc } from "src/utils/trpc";

export function DebugTrpc() {
  const postHello = trpc.post.hello.useQuery({ text: "mammma" });
  const { data: posts } = trpc.post.getAll.useQuery();

  return (
    <div className="whitespace-pre-wrap">
      <div>hello?.greeting: {postHello.data?.greeting}</div>
      <div>postHello.error: {JSON.stringify(postHello.error)}</div>
      <p>posts: {JSON.stringify(posts)}</p>
    </div>
  );
}
