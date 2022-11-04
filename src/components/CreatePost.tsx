"use client";

import { trpc } from "src/utils/trpc";
//import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { useSession } from "next-auth/react";

const specialPostId = "cla30qqe70000ui5akjssycip";

export function CreatePost() {
  const session = useSession();
  //const router = useRouter();

  const [text, setText] = useState("");
  const id = useId();

  const { data: posts } = trpc.post.getAll.useQuery();

  const { data: hello } = trpc.post.hello.useQuery({ text: "mammma" });

  const postCreate = trpc.post.create.useMutation();

  //const { data: specialPost } = trpc.post.getById.useQuery({ id: specialPostId });

  return (
    <div className="">
      <div>hello: {hello?.greeting}</div>

      {/*
      <div>specialPost: {JSON.stringify(specialPost)}</div>
      */}
      <label htmlFor={id}>text</label>
      <input id={id} type={"text"} value={text} onChange={(e) => setText(e.target.value)} />
      <button
        disabled={postCreate.isLoading || !session.data?.user}
        className="bg-green-400 px-3 py-2 disabled:bg-gray-400"
        onClick={async () => {
          try {
            console.log("sending text:", text);
            await postCreate.mutateAsync({ text });
            //router.refresh();
          } catch (error) {}
        }}
      >
        Create Post
      </button>
      {postCreate.error && <div className="text-red-600">{postCreate.error.message}</div>}
      <p>posts: {JSON.stringify(posts)}</p>
    </div>
  );
}
