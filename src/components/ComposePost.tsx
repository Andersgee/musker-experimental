"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
//import { useRouter } from "next/navigation";
import { useState } from "react";
import { DividerFull } from "src/ui/Divider";
import { trpc } from "src/utils/trpc";

type Props = {
  className?: string;
  onCreated?: () => void;
};

export function ComposePost({ onCreated, className }: Props) {
  const utils = trpc.useContext(); //https://trpc.io/docs/v10/useContext#helpers
  //const router = useRouter();
  const [text, setText] = useState("");
  const session = useSession();
  const postCreate = trpc.post.create.useMutation({
    onSuccess: () => {
      utils.post.getAll.invalidate();
    },
  });

  if (!session.data?.user) {
    return <div>sign in before you can post anything</div>;
  }
  return (
    <div className="flex w-full justify-between">
      <div className="">
        <Link href="/userhandle" className="flex w-12 items-center justify-center">
          <img
            className="h-8 w-8 rounded-full shadow-imageborder"
            src={session.data.user.image || undefined}
            alt={session.data.user.handle || session.data.user.name || undefined}
          />
        </Link>
      </div>

      <div className="flex-1">
        <div className="flex items-center">
          <input
            className="w-full"
            aria-label="compose"
            type={"text"}
            placeholder="Whats's happening?"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <DividerFull />
        <div className="flex items-baseline justify-between">
          <div>tweet options here</div>
          <button
            disabled={postCreate.isLoading || !session.data?.user || !text}
            className="rounded-full bg-sky-500 px-3 py-2 font-bold text-white disabled:bg-sky-300"
            onClick={async () => {
              try {
                await postCreate.mutateAsync({ text });
                onCreated?.();
              } catch (error) {}
            }}
          >
            Tweet
          </button>
        </div>
      </div>
    </div>
  );
}
