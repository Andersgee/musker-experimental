"use client";

import { DividerFull } from "src/ui/Divider";
import { trpc } from "src/utils/trpc";
import { useEffect, useRef } from "react";
import { useIntersectionObserver } from "src/hooks/useIntersectionObserver";
import { ImgUser } from "src/ui/ImgUser";

type Props = {
  className?: string;
};

export function HomeFeed({ className }: Props) {
  const query = trpc.post.homeFeed.useInfiniteQuery(
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

  return (
    <div className={className}>
      {query.data?.pages
        .map((page) => page.items)
        .flat()
        .map((post) => {
          return (
            <div key={post.id}>
              <article className="flex">
                <div>
                  <ImgUser
                    href={`/u/${post.author.handle}`}
                    image={post.author.image || ""}
                    alt={post.author.handle || post.author.name || ""}
                  />
                </div>
                <p>{post.text}</p>
              </article>
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
            {query.isFetchingNextPage ? "Loading more..." : query.hasNextPage ? "Load More" : "Nothing more to load"}
          </button>
        </div>
        <div>{query.isFetching && !query.isFetchingNextPage ? "looking for changes..." : null}</div>
      </div>
    </div>
  );
}
