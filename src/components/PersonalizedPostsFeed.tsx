"use client";

import { DividerFull } from "src/ui/Divider";
import { trpc } from "src/utils/trpc";
import { ImgUser } from "./ImgUser";

type Props = {
  className?: string;
};

export function PersonalizedPostsFeed({ className }: Props) {
  const { data: posts } = trpc.post.getAll.useQuery();

  return (
    <div className={className}>
      {posts?.map((post) => {
        return (
          <>
            <article className="flex" key={post.authorId}>
              <div>
                <ImgUser
                  href="lala"
                  image={post.author.image || ""}
                  alt={post.author.handle || post.author.name || ""}
                />
              </div>
              <p>{post.text}</p>
            </article>
            <DividerFull />
          </>
        );
      })}
    </div>
  );
}
