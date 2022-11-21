"use client";

import { trpc } from "src/utils/trpc";
import { DividerFull } from "src/ui/Divider";
import { IconMusker } from "src/icons/Musker";
import { ButtonLink } from "src/ui/ButtonLink";
import { Button } from "src/ui/Button";
import { UseIntersectionObserverCallback } from "src/hooks/useIntersectionObserverCallback";
import { useSession } from "next-auth/react";
import { Tweets as TweetsExplore } from "./explore/Tweets";
import { useDialogContext } from "src/contexts/Dialog";
import { Likes, Retweets, TweetBody, RepliedTo, RetweetedBy } from "src/components/Tweet";
import { useMemo } from "react";

//type Tweet = RouterOutput["home"]["tweets"]["items"][number];

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
          <div key={tweet.id} className="mt-2">
            {tweet.retweetedToTweet ? (
              <>
                <RetweetedBy handle={tweet.author.handle} />
                <TweetBody
                  tweetId={tweet.retweetedToTweet.id}
                  createdAt={tweet.retweetedToTweet.createdAt}
                  handle={tweet.retweetedToTweet.author.handle || ""}
                  image={tweet.retweetedToTweet.author.image || ""}
                  likes={tweet.retweetedToTweet._count.likes}
                  replies={tweet.retweetedToTweet._count.replies}
                  retweets={tweet.retweetedToTweet._count.retweets}
                  text={tweet.retweetedToTweet.text}
                />
              </>
            ) : (
              <>
                <RepliedTo tweet={tweet} repliedToTweet={tweet.repliedToTweet} />
                <Retweets retweets={tweet.retweets} />
                <Likes likes={tweet.likes} />
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
      {tweets && !hasNextPage && <EndOfFeed />}
    </div>
  );
}

///////////////////////////////

function EndOfFeed() {
  return (
    <div className="mb-4">
      <div className="">
        <IconMusker className="h-auto w-full" />
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
      <IconMusker className="h-auto w-full" />
      <h3>Go follow some people to make this feed peronal.</h3>
      <p>(Until then you will just see the general explore feed here)</p>
      <TweetsExplore />
    </div>
  );
}
