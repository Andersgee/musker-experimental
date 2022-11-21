"use client";

import { DividerFull } from "src/ui/Divider";
import { trpc } from "src/utils/trpc";
import { Button } from "src/ui/Button";
import { UseIntersectionObserverCallback } from "src/hooks/useIntersectionObserverCallback";
import { TweetBody } from "src/components/Tweet";
import { useMemo } from "react";

type Props = {
  tweetId: number;
  className?: string;
};

export function Tweets({ tweetId, className = "" }: Props) {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = trpc.replies.tweets.useInfiniteQuery(
    { tweetId },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );
  const tweets = useMemo(() => data?.pages.map((page) => page.items).flat(), [data]);

  const ref = UseIntersectionObserverCallback<HTMLDivElement>(([entry]) => {
    const isVisible = !!entry?.isIntersecting;
    if (isVisible && hasNextPage !== false) {
      fetchNextPage();
    }
  });

  return (
    <div className={className}>
      {tweets?.map((tweet) => {
        return (
          <div key={tweet.id}>
            <TweetBody
              tweetId={tweet.id}
              createdAt={tweet.createdAt}
              handle={tweet.author.handle || ""}
              image={tweet.author.image || ""}
              likes={tweet._count.likes}
              replies={tweet._count.replies}
              retweets={tweet._count.retweets}
              text={tweet.text}
            />
            <DividerFull />
          </div>
        );
      })}
      <div ref={ref} className="mt-4 flex justify-center">
        <Button onClick={() => fetchNextPage()} disabled={!hasNextPage || isFetchingNextPage}>
          {isFetchingNextPage ? "loading..." : hasNextPage ? "Load More" : ""}
        </Button>
      </div>
    </div>
  );
}
