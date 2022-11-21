"use client";

import { DividerFull } from "src/ui/Divider";
import { trpc, type RouterOutput } from "src/utils/trpc";
import Link from "next/link";
import { Button } from "src/ui/Button";
import { UseIntersectionObserverCallback } from "src/hooks/useIntersectionObserverCallback";
import { IconRewteet } from "src/icons/Retweet";
import { IconReply } from "src/icons/Reply";
import { TweetBody } from "src/components/Tweet";
import { useMemo } from "react";
import { hashidFromNumber } from "src/utils/hashids";

type Tweet = RouterOutput["explore"]["tweets"]["items"][number];

type Props = {
  className?: string;
};

export function Tweets({ className = "" }: Props) {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isLoading } = trpc.explore.tweets.useInfiniteQuery(
    {},
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

  const buttonIsDisabled = !hasNextPage || isFetchingNextPage;

  return (
    <div className={className}>
      {tweets?.map((tweet) => {
        return (
          <div key={tweet.id}>
            {tweet.retweetedToTweet ? (
              <ReTweet retweeterHandle={tweet.author.handle?.text} tweet={tweet.retweetedToTweet} />
            ) : (
              <Tweet tweet={tweet} />
            )}
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
      </div>
    </div>
  );
}

function Tweet({ tweet }: { tweet: Tweet }) {
  return (
    <div className="mt-2">
      {tweet.repliedToTweet && (
        <div className="flex font-paragraph text-sm">
          <div className="flex w-10 justify-end">
            <IconReply className="mr-2 w-4" />
          </div>
          <Link href={`/${tweet.author.handle?.text}`} className="hover:underline">
            {tweet.author.handle?.text}{" "}
          </Link>
          <div className="ml-1">
            replied to{" "}
            <Link
              href={`/${tweet.repliedToTweet.author.handle?.text}/${hashidFromNumber(tweet.repliedToTweet?.id)}`}
              className="hover:underline"
            >
              tweet by {tweet.repliedToTweet.author.handle?.text}
            </Link>
          </div>
        </div>
      )}

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
    </div>
  );
}

type RetweetedTweet = NonNullable<Tweet["retweetedToTweet"]>;

function ReTweet({ tweet, retweeterHandle }: { tweet: RetweetedTweet; retweeterHandle?: string }) {
  return (
    <div className="mt-2">
      <div className="flex font-paragraph text-sm">
        <div className="flex w-10 justify-end">
          <IconRewteet className="mr-2 w-4" />
        </div>
        <Link href={`/${retweeterHandle}`} className="hover:underline">
          {retweeterHandle}
        </Link>
        <div className="ml-1">retweeted</div>
      </div>

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
    </div>
  );
}
