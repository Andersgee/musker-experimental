"use client";

import { DividerFull } from "src/ui/Divider";
import { trpc } from "src/utils/trpc";
import { useEffect, useRef } from "react";
import { useIntersectionObserver } from "src/hooks/useIntersectionObserver";
//import { ImgUser } from "src/ui/ImgUser";
import { Post } from "./Post";
import { Button } from "src/ui/Button";

type Props = {
  className?: string;
};

export function ExploreFeed({ className }: Props) {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isFetching } = trpc.post.exploreFeed.useInfiniteQuery(
    {},
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  const ref = useRef(null);
  const entry = useIntersectionObserver(ref, { freezeOnceVisible: false, rootMargin: "600px" });

  useEffect(() => {
    console.log("triggered effect");
    if (data && entry?.isIntersecting && hasNextPage && !isFetching) {
      console.log("fetchNextPage triggered");
      fetchNextPage();
    }
  }, [entry, hasNextPage, data, isFetching, fetchNextPage]);

  const buttonIsDisabled = !hasNextPage || isFetchingNextPage;
  const posts = data?.pages.map((page) => page.items).flat();

  if (!posts) {
    return <div>no posts</div>;
  }

  return (
    <div className={className}>
      {posts.map((post) => {
        return (
          <div key={post.id}>
            <Post post={post} />
            <DividerFull />
          </div>
        );
      })}
      <div className="mt-4 flex justify-center">
        <div ref={ref}>
          <Button onClick={() => fetchNextPage()} disabled={buttonIsDisabled}>
            {isFetchingNextPage ? "loading..." : hasNextPage ? "Load More" : ""}
          </Button>
        </div>
        {!hasNextPage && <div>nothing more to see</div>}
        {/*<div>{query.isFetching && !query.isFetchingNextPage ? "looking for changes..." : null}</div>*/}
      </div>
    </div>
  );
}
