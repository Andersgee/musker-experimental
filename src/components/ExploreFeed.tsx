"use client";

import { DividerFull } from "src/ui/Divider";
import { trpc } from "src/utils/trpc";
import { useCallback } from "react";
//import { useIntersectionObserver } from "src/hooks/useIntersectionObserver";
//import { ImgUser } from "src/ui/ImgUser";
import { Tweet } from "./Tweet";
import { Button } from "src/ui/Button";
import { UseIntersectionObserverCallback } from "src/hooks/useIntersectionObserverCallback";

type Props = {
  className?: string;
};

export function ExploreFeed({ className = "" }: Props) {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = trpc.tweet.exploreFeed.useInfiniteQuery(
    {},
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  /*
  const ref = useCallback((node: HTMLDivElement) => {
    //see https://reactjs.org/docs/hooks-faq.html#how-can-i-measure-a-dom-node
    if (node !== null) {
      const rootMargin = "0px";
      const observer = new IntersectionObserver(
        ([entry]) => {
          const isVisible = !!entry?.isIntersecting;
          if (isVisible) {
            fetchNextPage();
          }
        },
        { rootMargin },
      );
      observer.observe(node);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  */

  const ref = UseIntersectionObserverCallback<HTMLDivElement>(() => fetchNextPage());

  const buttonIsDisabled = !hasNextPage || isFetchingNextPage;
  const tweets = data?.pages.map((page) => page.items).flat();

  if (!tweets) {
    return <div>no tweets</div>;
  }

  return (
    <div className={className}>
      {tweets.map((tweet) => {
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
        <div></div>
        {!hasNextPage && <div>nothing more to see</div>}
        {/*<div>{query.isFetching && !query.isFetchingNextPage ? "looking for changes..." : null}</div>*/}
      </div>
    </div>
  );
}
