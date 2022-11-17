"use client";

import { DividerFull } from "src/ui/Divider";
import { trpc, type RouterOutput } from "src/utils/trpc";
import Link from "next/link";
import { IconMusker } from "src/icons/Musker";
import { ButtonLink } from "src/ui/ButtonLink";
import { Button } from "src/ui/Button";
import { UseIntersectionObserverCallback } from "src/hooks/useIntersectionObserverCallback";
import { TweetActions } from "src/components/TweetActions";
import { formatCreatedAt } from "src/utils/date";
import { IconHeart } from "src/icons/Heart";
import { IconRewteet } from "src/icons/Retweet";

type Tweet = RouterOutput["home"]["tweets"]["items"][number];

type Props = {
  className?: string;
};

export function Tweets({ className = "" }: Props) {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isLoading } = trpc.home.tweets.useInfiniteQuery(
    {},
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  const ref = UseIntersectionObserverCallback<HTMLDivElement>(([entry]) => {
    const isVisible = !!entry?.isIntersecting;
    if (isVisible && hasNextPage !== false) {
      fetchNextPage();
    }
  });

  const buttonIsDisabled = !hasNextPage || isFetchingNextPage;
  const tweets = data?.pages.map((page) => page.items).flat();

  if (!isLoading && (!tweets || tweets?.length < 1)) {
    return <EndOfFeed />;
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

function Tweet({ tweet }: { tweet: Tweet }) {
  return (
    <div className="mt-2">
      {tweet.tweetLikes.length > 0 && (
        <div className="flex font-paragraph text-sm">
          <div className="flex w-10 justify-end">
            <IconHeart className="mr-2 w-4" />
          </div>
          {tweet.tweetLikes.map((tweetLike) => (
            <Link key={tweetLike.userId} href={`/${tweetLike.user.handle?.text}`} className="hover:underline">
              {tweetLike.user.handle?.text}
            </Link>
          ))}
          <div className="ml-1">liked</div>
        </div>
      )}
      {tweet.retweets.length > 0 && (
        <div className="flex font-paragraph text-sm">
          <div className="flex w-10 justify-end">
            <IconRewteet className="mr-2 w-4" />
          </div>
          {tweet.retweets.map((retweet) => (
            <Link key={retweet.userId} href={`/${retweet.user.handle?.text}`} className="hover:underline">
              {retweet.user.handle?.text}
            </Link>
          ))}
          <div className="ml-1">retweeted</div>
        </div>
      )}

      <article className="flex">
        <div className="">
          <a href={`/${tweet.author.handle?.text}`} className="w-12">
            <img
              className="h-8 w-8 rounded-full shadow-imageborder"
              src={tweet.author.image || ""}
              alt={tweet.author.handle?.text}
            />
          </a>
        </div>
        <div className="flex-1 py-2 pl-2 ">
          <Link href={`/${tweet.author.handle?.text}/${tweet.id}`}>
            <div className=" hover:bg-neutral-100 dark:hover:bg-neutral-800">
              <h3 className="text-base font-normal">
                {`${tweet.author.handle?.text} - ${formatCreatedAt(tweet.createdAt)}`}{" "}
                <span className=" text-neutral-500">
                  {tweet.parentTweet?.author && `(Replying to ${tweet.parentTweet.author.handle?.text})`}
                </span>
              </h3>
              <p>{tweet.text}</p>
            </div>
          </Link>
          <TweetActions
            tweetId={tweet.id}
            authorHandle={tweet.author.handle?.text || ""}
            likes={tweet._count.tweetLikes}
            replies={tweet._count.childTweets}
            retweets={tweet._count.retweets}
          />
        </div>
      </article>
    </div>
  );
}
