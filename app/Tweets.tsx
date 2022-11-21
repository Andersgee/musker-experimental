"use client";

import { DividerFull } from "src/ui/Divider";
import { trpc, type RouterOutput } from "src/utils/trpc";
import Link from "next/link";
import { IconMusker } from "src/icons/Musker";
import { ButtonLink } from "src/ui/ButtonLink";
import { Button } from "src/ui/Button";
import { UseIntersectionObserverCallback } from "src/hooks/useIntersectionObserverCallback";
import { IconRewteet } from "src/icons/Retweet";
import { IconReply } from "src/icons/Reply";
import { useSession } from "next-auth/react";
import { hashidFromNumber } from "src/utils/hashids";

import { Tweets as TweetsExplore } from "./explore/Tweets";
import { useDialogContext } from "src/contexts/Dialog";
import { Likes, Retweets, TweetBody } from "src/components/Tweet";
import { useMemo } from "react";

type Tweet = RouterOutput["home"]["tweets"]["items"][number];

type Props = {
  className?: string;
};

export function Tweets({ className = "" }: Props) {
  const { data: session } = useSession();
  const userExists = !!session?.user;
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = trpc.home.tweets.useInfiniteQuery(
    {},
    {
      enabled: userExists,
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

  if (!userExists) {
    return <FallbackNoUser />;
  }

  if (userExists && tweets && tweets.length < 1) {
    return <FallbackNoTweets />;
  }

  return (
    <div className={className}>
      {tweets?.map((tweet) => {
        return (
          <div key={tweet.id}>
            {tweet.retweetedToTweet ? (
              <ReTweet retweeterHandle={tweet.author.handle?.text} tweet={tweet.retweetedToTweet} />
            ) : (
              <FullTweet tweet={tweet} />
            )}
            <DividerFull />
          </div>
        );
      })}
      <div className="mt-4 flex justify-center">
        <div ref={ref}>
          <Button onClick={() => fetchNextPage()} disabled={!hasNextPage || isFetchingNextPage}>
            {isFetchingNextPage ? "loading..." : hasNextPage ? "Load More" : ""}
          </Button>
        </div>
      </div>
      <div></div>
      {!hasNextPage && <EndOfFeed />}
    </div>
  );
}

function FullTweet({ tweet }: { tweet: Tweet }) {
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
              href={`/${tweet.repliedToTweet.author.handle?.text}/${hashidFromNumber(tweet.repliedToTweet.id)}`}
              className="hover:underline"
            >
              tweet by {tweet.repliedToTweet.author.handle?.text}
            </Link>
          </div>
        </div>
      )}
      <Retweets retweets={tweet.retweets} />
      <Likes likes={tweet.likes} />
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

///////////////////////////////

function EndOfFeed() {
  return (
    <div className="mb-4">
      <div className="">
        <IconMusker className="w-full" />
        <h3 className="text-center">
          You have seen all tweets from the people you follow. <br />
          Go follow some people.
        </h3>
      </div>
      <div className="flex w-full justify-center">
        <ButtonLink href="/explore">explore</ButtonLink>
      </div>
    </div>
  );
}

function FallbackNoUser() {
  const { setShowSignIn } = useDialogContext();

  return (
    <>
      <div className="mb-12 flex flex-col items-center gap-2 text-center">
        <IconMusker className="h-auto w-full" />

        <h3>You are not signed in</h3>
        <p>showing you explore feed instead of your personal feed</p>
        <Button className="block w-32" onClick={() => setShowSignIn(true)}>
          sign in
        </Button>
      </div>
      <DividerFull />
      <TweetsExplore />
    </>
  );
}

function FallbackNoTweets() {
  return (
    <div className="text-center">
      <IconMusker className="w-full" />
      <h3>Go follow some people to make this feed peronal.</h3>
      <p>(Until then you will just see the general explore feed here)</p>
      <TweetsExplore />
    </div>
  );
}
