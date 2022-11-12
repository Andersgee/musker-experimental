"use client";

import { DividerFull } from "src/ui/Divider";
import { trpc } from "src/utils/trpc";
import { useEffect, useMemo, useRef } from "react";
import { useIntersectionObserver } from "src/hooks/useIntersectionObserver";
import Link from "next/link";
import { Post } from "./Post";
import { IconMusker } from "src/icons/Musker";
import { ButtonLink } from "src/ui/ButtonLink";
import { Button } from "src/ui/Button";
//import { useIsInView } from "src/hooks/useIsInView";

type Props = {
  className?: string;
};

export function HomeFeed({ className }: Props) {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isFetching } = trpc.post.homeFeed.useInfiniteQuery(
    {},
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  const ref = useRef(null);
  const entry = useIntersectionObserver(ref, { freezeOnceVisible: false });
  const isVisible = !!entry?.isIntersecting;

  useEffect(() => {
    if (isVisible && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [isVisible]);

  const buttonIsDisabled = !hasNextPage || isFetchingNextPage;
  const posts = data?.pages.map((page) => page.items).flat();

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
      <div className="mt-4 flex justify-center">
        <div ref={ref}>
          <Button onClick={() => fetchNextPage()} disabled={buttonIsDisabled}>
            {isFetchingNextPage ? "loading..." : hasNextPage ? "Load More" : ""}
          </Button>
        </div>
        {/*<div>{query.isFetching && !query.isFetchingNextPage ? "looking for changes..." : null}</div>*/}
      </div>
      <div></div>
      {!hasNextPage && <EndOfFeed />}
    </div>
  );
}

function EndOfFeed() {
  return (
    <div className="">
      <div className="">
        <IconMusker className="w-full" />
        <p className="">You have seen all posts from the people you follow. Go follow some people.</p>
      </div>
      <div className="flex w-full justify-center">
        <ButtonLink href="/explore">explore</ButtonLink>
      </div>
    </div>
  );
}
