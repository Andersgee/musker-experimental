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
import { hashidFromNumber } from "src/utils/hashids";

type Tweet = RouterOutput["profile"]["likes"]["items"][number]["tweet"];

type Props = {
  className?: string;
  userId: string;
  userHandle: string;
};

export function Likes({ userId, userHandle, className = "" }: Props) {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isLoading } = trpc.profile.likes.useInfiniteQuery(
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
  const tweetLikes = data?.pages.map((page) => page.items).flat();

  if (!isLoading && (!tweetLikes || tweetLikes?.length < 1)) {
    return null;
  }

  return (
    <div className={className}>
      {tweetLikes?.map((tweetLike) => {
        return (
          <div key={tweetLike.tweetId}>
            <Tweet likerHandle={userHandle} tweet={tweetLike.tweet} />
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
      <div></div>
    </div>
  );
}

function Tweet({ likerHandle, tweet }: { likerHandle: string; tweet: Tweet }) {
  return (
    <div className="mt-2">
      <div className="flex font-paragraph text-sm">
        <div className="flex w-10 justify-end">
          <IconHeart className="mr-2 w-4" />
        </div>
        <Link href={`/${likerHandle}`} className="hover:underline">
          {likerHandle}
        </Link>
        <div className="ml-1">liked</div>
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
