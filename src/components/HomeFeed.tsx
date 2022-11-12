"use client";

import { DividerFull } from "src/ui/Divider";
import { trpc } from "src/utils/trpc";
import { useEffect, useRef } from "react";
import { useIntersectionObserver } from "src/hooks/useIntersectionObserver";
import Link from "next/link";
import { Post } from "./Post";
import { IconMusker } from "src/icons/Musker";
import { ButtonLink } from "src/ui/ButtonLink";

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

  const posts = query.data?.pages.map((page) => page.items).flat();

  if (!posts || posts?.length < 1) {
    return (
      <div>
        go follow some people,{" "}
        <Link href="/explore" className="rounded-full bg-black px-3 py-2 text-white">
          explore here
        </Link>
      </div>
    );
  }

  return (
    <div className={className}>
      {posts?.map((post) => {
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
            {query.isFetchingNextPage ? "loading..." : query.hasNextPage ? "Load More" : ""}
          </button>
        </div>
        {/*<div>{query.isFetching && !query.isFetchingNextPage ? "looking for changes..." : null}</div>*/}
      </div>
      {!query.hasNextPage && (
        <div className="">
          <div>
            <IconMusker className="w-full" />
            <p>You have seen all posts from the people you follow. Go follow some poeple.</p>
          </div>
          <div className="flex justify-center">
            <ButtonLink href="/explore">explore</ButtonLink>
          </div>
        </div>
      )}
    </div>
  );
}
