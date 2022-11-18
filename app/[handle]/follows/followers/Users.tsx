"use client";

import { DividerFull } from "src/ui/Divider";
import { trpc } from "src/utils/trpc";
import { Button } from "src/ui/Button";
import { UseIntersectionObserverCallback } from "src/hooks/useIntersectionObserverCallback";
import Link from "next/link";
import { FollowButton } from "src/components/FollowButton";

type Props = {
  className?: string;
  userId: string;
};

export function Users({ userId, className = "" }: Props) {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = trpc.follows.followers.useInfiniteQuery(
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
  const follows = data?.pages.map((page) => page.items).flat();

  if (!follows || follows?.length < 1) {
    return null;
  }

  return (
    <div className={className}>
      {follows.map((follow) => {
        return (
          <div key={follow.followerId}>
            <div className="flex">
              <Link href={`/${follow.follower.handle?.text}`} className="flex flex-1 items-center">
                <img
                  src={follow.follower.image || undefined}
                  alt={follow.follower.handle?.text}
                  className="h-12 w-12"
                />
                <h3>{follow.follower.handle?.text}</h3>
              </Link>
              <FollowButton userId={follow.followerId} />
            </div>
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
      {!hasNextPage && <div>nothing more to see</div>}
    </div>
  );
}
