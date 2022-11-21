"use client";

import { DividerFull } from "src/ui/Divider";
import { trpc } from "src/utils/trpc";
import { Button } from "src/ui/Button";
import { UseIntersectionObserverCallback } from "src/hooks/useIntersectionObserverCallback";
import { useMemo } from "react";
import { TweetBody, Likes as TweetLikes } from "src/components/Tweet";

//type TweetLike = RouterOutput["profile"]["likes"]["items"][number]["tweet"];

type Props = {
  className?: string;
  userId: string;
  userHandle: string;
};

export function Tweets({ userId, userHandle, className = "" }: Props) {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = trpc.profile.likes.useInfiniteQuery(
    { userId },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );
  const tweetLikes = useMemo(() => data?.pages.map((page) => page.items).flat(), [data]);

  const ref = UseIntersectionObserverCallback<HTMLDivElement>(([entry]) => {
    const isVisible = !!entry?.isIntersecting;
    if (isVisible && hasNextPage !== false) {
      fetchNextPage();
    }
  });

  return (
    <div className={className}>
      {tweetLikes?.map((tweetLike) => {
        //this page lists only tweets that this user liked, so display only this user as liker
        const likes = [
          {
            user: {
              handle: { text: userHandle },
            },
            userId: tweetLike.userId,
          },
        ];

        return (
          <div key={tweetLike.tweetId}>
            <TweetLikes likes={likes} />
            <TweetBody
              tweetId={tweetLike.tweet.id}
              createdAt={tweetLike.tweet.createdAt}
              handle={tweetLike.tweet.author.handle?.text || ""}
              image={tweetLike.tweet.author.image || ""}
              likes={tweetLike.tweet._count.likes}
              replies={tweetLike.tweet._count.replies}
              retweets={tweetLike.tweet._count.retweets}
              text={tweetLike.tweet.text}
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
