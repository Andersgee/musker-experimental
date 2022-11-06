"use client";

import { trpc } from "src/utils/trpc";

type Props = {
  userId: string;
  className?: string;
};

export function FollowButton({ userId, className }: Props) {
  const { data: isFollowing } = trpc.user.isFollowing.useQuery({ userId });
  const { mutateAsync: follow } = trpc.user.follow.useMutation();
  const { mutateAsync: unfollow } = trpc.user.unfollow.useMutation();

  const handleClick = () => {
    if (isFollowing) {
      unfollow({ userId });
    } else {
      follow({ userId });
    }
  };

  return <button onClick={handleClick}> {isFollowing ? "unfollow" : "follow"}</button>;
}
