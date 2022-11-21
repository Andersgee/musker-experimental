"use client";

import { trpc } from "src/utils/trpc";
import { DividerFull } from "src/ui/Divider";
import { Button } from "src/ui/Button";
import { UseIntersectionObserverCallback } from "src/hooks/useIntersectionObserverCallback";
import { useMemo } from "react";
import { Likes, RepliedTo, RetweetedBy, TweetBody } from "src/components/Tweet";

type Props = {
  className?: string;
  userId: string;
};

export function Tweets({ userId, className = "" }: Props) {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = trpc.profile.tweets.useInfiniteQuery(
    { userId },
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
            {tweet.retweetedToTweet ? (
              <>
                <RetweetedBy handle={tweet.author.handle?.text} />
                <TweetBody
                  tweetId={tweet.retweetedToTweet.id}
                  createdAt={tweet.retweetedToTweet.createdAt}
                  handle={tweet.retweetedToTweet.author.handle?.text || ""}
                  image={tweet.retweetedToTweet.author.image || ""}
                  likes={tweet.retweetedToTweet._count.likes}
                  replies={tweet.retweetedToTweet._count.replies}
                  retweets={tweet.retweetedToTweet._count.retweets}
                  text={tweet.retweetedToTweet.text}
                />
              </>
            ) : (
              <>
                <Likes likes={tweet.likes} />
                <RepliedTo tweet={tweet} repliedToTweet={tweet.repliedToTweet} />
                <TweetBody
                  tweetId={tweet.id}
                  createdAt={tweet.createdAt}
                  handle={tweet.author.handle?.text || ""}
                  image={tweet.author.image || ""}
                  likes={tweet._count.likes}
                  replies={tweet._count.replies}
                  retweets={tweet._count.retweets}
                  text={tweet.text}
                />
              </>
            )}
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
