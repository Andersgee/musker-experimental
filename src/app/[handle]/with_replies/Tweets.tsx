"use client";

import { DividerFull } from "src/ui/Divider";
import { trpc, type RouterOutput } from "src/utils/trpc";
import Link from "next/link";
import { Button } from "src/ui/Button";
import { UseIntersectionObserverCallback } from "src/hooks/useIntersectionObserverCallback";
import { TweetActions } from "src/components/TweetActions";
import { formatCreatedAt } from "src/utils/date";
import { IconHeart } from "src/icons/Heart";
import { IconRewteet } from "src/icons/Retweet";
import { IconReply } from "src/icons/Reply";
import { hashidFromNumber } from "src/utils/hashids";

type Tweet = RouterOutput["profile"]["tweets"]["items"][number];

type Props = {
  className?: string;
  userId: string;
};

export function Tweets({ userId, className = "" }: Props) {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isLoading } = trpc.profile.tweets.useInfiniteQuery(
    { userId },
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
    return null;
  }

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
        {/*<div>{query.isFetching && !query.isFetchingNextPage ? "looking for changes..." : null}</div>*/}
      </div>
      <div></div>
      {!hasNextPage && <div>nothing more to see</div>}
    </div>
  );
}

function Tweet({ tweet }: { tweet: Tweet }) {
  return (
    <div className="mt-2">
      {tweet.likes.length > 0 && (
        <div className="flex font-paragraph text-sm">
          <div className="flex w-10 justify-end">
            <IconHeart className="mr-2 w-4" />
          </div>
          {tweet.likes.map((like) => (
            <Link key={like.userId} href={`/${like.user.handle?.text}`} className="hover:underline">
              {like.user.handle?.text}
            </Link>
          ))}
          <div className="ml-1">liked</div>
        </div>
      )}
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
              href={`/${tweet.repliedToTweet.author.handle?.text}/${tweet.repliedToTweet?.id}`}
              className="hover:underline"
            >
              tweet by {tweet.repliedToTweet.author.handle?.text}
            </Link>
          </div>
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
          <Link href={`/${tweet.author.handle?.text}/${hashidFromNumber(tweet.id)}`}>
            <div className=" hover:bg-neutral-100 dark:hover:bg-neutral-800">
              <h3 className="text-base font-normal">
                {tweet.author.handle?.text} - {formatCreatedAt(tweet.createdAt)}
              </h3>
              <p>{tweet.text}</p>
            </div>
          </Link>
          <TweetActions
            tweetId={tweet.id}
            authorHandle={tweet.author.handle?.text || ""}
            likes={tweet._count.likes}
            replies={tweet._count.replies}
            retweets={tweet._count.retweets}
          />
        </div>
      </article>
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
          <Link href={`/${tweet.author.handle?.text}/${hashidFromNumber(tweet.id)}`}>
            <div className=" hover:bg-neutral-100 dark:hover:bg-neutral-800">
              <h3 className="text-base font-normal">
                {`${tweet.author.handle?.text} - ${formatCreatedAt(tweet.createdAt)}`}
              </h3>
              <p>{tweet.text}</p>
            </div>
          </Link>
          <TweetActions
            tweetId={tweet.id}
            authorHandle={tweet.author.handle?.text || ""}
            likes={tweet._count.likes}
            replies={tweet._count.replies}
            retweets={tweet._count.retweets}
          />
        </div>
      </article>
    </div>
  );
}
