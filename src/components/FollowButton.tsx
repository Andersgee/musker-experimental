"use client";

import { useSession } from "next-auth/react";
import { useDialogContext } from "src/contexts/Dialog";
import { Button } from "src/ui/Button";
import { trpc } from "src/utils/trpc";

type Props = {
  userId: string;
  className?: string;
};

export function FollowButton({ userId, className = "" }: Props) {
  const { setShowSignIn } = useDialogContext();
  const { data: session } = useSession();
  const userExists = !!session?.user;
  const utils = trpc.useContext();

  const { data: isFollowing } = trpc.user.isFollowing.useQuery(
    { userId },
    {
      enabled: userExists,
    },
  );
  const { mutateAsync: follow } = trpc.user.follow.useMutation({
    onSuccess: () => {
      utils.user.isFollowing.invalidate();
    },
  });
  const { mutateAsync: unfollow } = trpc.user.unfollow.useMutation({
    onSuccess: () => {
      utils.user.isFollowing.invalidate();
    },
  });

  const handleClick = () => {
    if (!userExists) {
      setShowSignIn(true);
      return;
    }
    if (isFollowing) {
      unfollow({ userId });
    } else {
      follow({ userId });
    }
  };

  return (
    <Button className={`w-24 border border-white bg-black text-white ${className}`} onClick={handleClick}>
      {isFollowing ? "Unfollow" : "Follow"}
    </Button>
  );
}
