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
  userId: string;
  className?: string;
};

export function UserTweets({ userId, className = "" }: Props) {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isFetching } = trpc.tweet.byUser.useInfiniteQuery(
    { userId },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  const ref = useRef(null);
  const isVisible = useIsIntersecting(ref);

  useEffect(() => {
    if (isVisible && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [isVisible, hasNextPage]);

  const buttonIsDisabled = !hasNextPage || isFetchingNextPage;
  const tweets = data?.pages.map((page) => page.items).flat();

  if (!tweets || tweets.length < 1) {
    return null;
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
      {!hasNextPage && <div>nothing more to see</div>}
    </div>
  );
}
