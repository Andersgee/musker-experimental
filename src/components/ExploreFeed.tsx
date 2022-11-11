"use client";

import { DividerFull } from "src/ui/Divider";
import { trpc } from "src/utils/trpc";
import { useEffect, useRef } from "react";
import { useIntersectionObserver } from "src/hooks/useIntersectionObserver";
import { ImgUser } from "src/ui/ImgUser";
import { Post } from "./Post";

type Props = {
  className?: string;
};

export function ExploreFeed({ className }: Props) {
  const query = trpc.post.exploreFeed.useInfiniteQuery(
    {},
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  const ref = useRef(null);
  const entry = useIntersectionObserver(ref, { freezeOnceVisible: false, rootMargin: "100%" });
  const loadMoreIsInView = !!entry?.isIntersecting;

  useEffect(() => {
    if (loadMoreIsInView && query.hasNextPage && query.fetchNextPage) {
      query.fetchNextPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadMoreIsInView]);

  const posts = query.data?.pages.map((page) => page.items).flat();

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
      <div className="flex justify-center">
        <div>
          <button
            ref={ref}
            onClick={() => query.fetchNextPage()}
            disabled={!query.hasNextPage || query.isFetchingNextPage}
          >
            {query.isFetchingNextPage ? "loading..." : query.hasNextPage ? "Load More" : "-"}
          </button>
        </div>
        {/*<div>{query.isFetching && !query.isFetchingNextPage ? "looking for changes..." : null}</div>*/}
      </div>
    </div>
  );
}
