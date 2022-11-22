"use client";

import { DividerFull } from "src/ui/Divider";
import { trpc } from "src/utils/trpc";
import { Button } from "src/ui/Button";
import { UseIntersectionObserverCallback } from "src/hooks/useIntersectionObserverCallback";
import { useSession } from "next-auth/react";
import { UserRow } from "./UserRow";
import { useMemo } from "react";

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
  const follows = useMemo(() => data?.pages.map((page) => page.items).flat(), [data]);

  const ref = UseIntersectionObserverCallback<HTMLDivElement>(([entry]) => {
    const isVisible = !!entry?.isIntersecting;
    if (isVisible && hasNextPage !== false) {
      fetchNextPage();
    }
  });
  if (!userExists) {
    return null;
  }

  return (
    <div className={className}>
      <ul>
        {follows?.map((follow) => {
          return (
            <li key={follow.followerId}>
              <UserRow
                userId={follow.followerId}
                image={follow.follower.image || ""}
                handle={follow.follower.handle || ""}
              />
              <DividerFull />
            </li>
          );
        })}
      </ul>
      <div ref={ref} className="mt-4 flex justify-center">
        <Button onClick={() => fetchNextPage()} disabled={!hasNextPage || isFetchingNextPage}>
          {isFetchingNextPage ? "loading..." : hasNextPage ? "Load More" : ""}
        </Button>
      </div>
    </div>
  );
}
