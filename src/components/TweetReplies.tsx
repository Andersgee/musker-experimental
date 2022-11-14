"use client";

import { DividerFull } from "src/ui/Divider";
import { trpc } from "src/utils/trpc";
import { useEffect, useRef } from "react";
//import { ImgUser } from "src/ui/ImgUser";
import { Tweet } from "./Tweet";
import { Button } from "src/ui/Button";
import { useIsIntersecting } from "src/hooks/useIsIntersecting";

type Props = {
  className?: string;
  tweetId: string;
};

export function TweetReplies({ tweetId, className = "" }: Props) {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = trpc.tweet.replies.useInfiniteQuery(
    { tweetId },
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

  if (!tweets) {
    return <div>no tweets</div>;
  }

  return (
    <div className={className}>
      {tweets.map((tweet) => {
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
        <div></div>
        {!hasNextPage && <div>nothing more to see</div>}
        {/*<div>{query.isFetching && !query.isFetchingNextPage ? "looking for changes..." : null}</div>*/}
      </div>
    </div>
  );
}
