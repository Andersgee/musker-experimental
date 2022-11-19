"use client";

import { DividerFull } from "src/ui/Divider";
import { trpc } from "src/utils/trpc";
import { Button } from "src/ui/Button";
import { UseIntersectionObserverCallback } from "src/hooks/useIntersectionObserverCallback";
import Link from "next/link";
import { FollowButton } from "src/components/FollowButton";
import { useSession } from "next-auth/react";

type Props = {
  className?: string;
  userId: string;
};

export function Users({ userId, className = "" }: Props) {
  const { data: session } = useSession();
  const userExists = !!session?.user;
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = trpc.follows.knownFollowers.useInfiniteQuery(
    { userId },
    {
      enabled: userExists,
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

  if (!follows || follows.length < 1) {
    return null;
  }

  return (
    <div className={className}>
      {follows.map((user) => {
        return (
          <div key={user.id}>
            <div className="flex">
              <Link href={`/${user.handle?.text}`} className="flex flex-1 items-center">
                <img src={user.image || undefined} alt={user.handle?.text} className="h-12 w-12" />
                <h3>{user.handle?.text}</h3>
              </Link>
              <FollowButton userId={user.id} />
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
