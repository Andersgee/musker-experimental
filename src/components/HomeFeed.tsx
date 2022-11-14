"use client";

import { DividerFull } from "src/ui/Divider";
import { trpc } from "src/utils/trpc";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { Tweet } from "./Tweet";
import { IconMusker } from "src/icons/Musker";
import { ButtonLink } from "src/ui/ButtonLink";
import { Button } from "src/ui/Button";
import { useIsIntersecting } from "src/hooks/useIsIntersecting";

type Props = {
  className?: string;
};

export function HomeFeed({ className = "" }: Props) {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = trpc.tweet.homeFeed.useInfiniteQuery(
    {},
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  const ref = useRef(null);
  const isVisible = useIsIntersecting(ref);

  useEffect(() => {
    if (isVisible && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isVisible, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const buttonIsDisabled = !hasNextPage || isFetchingNextPage;
  const tweets = data?.pages.map((page) => page.items).flat();

  if (!tweets || tweets?.length < 1) {
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
      {tweets?.map((tweet) => {
        return (
          <div key={tweet.id}>
            <Tweet tweet={tweet} />
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
    <div className="mb-4">
      <div className="">
        <IconMusker className="w-full" />
        <p className="">You have seen all tweets from the people you follow. Go follow some people.</p>
      </div>
      <div className="flex w-full justify-center">
        <ButtonLink href="/explore">explore</ButtonLink>
      </div>
    </div>
  );
}
