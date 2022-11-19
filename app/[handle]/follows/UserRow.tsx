"use clinet";

import Link from "next/link";
import { FollowButton } from "src/components/FollowButton";

type Props = {
  userId: string;
  image: string;
  handle: string;
  className?: string;
};

export function UserRow({ userId, image, handle, className = "" }: Props) {
  return (
    <div className={`my-2 flex ${className}`}>
      <Link href={`/${handle}`} className="flex flex-1 items-center">
        <img src={image} alt={handle} className="h-8 w-8" />
        <h3>{handle}</h3>
      </Link>
      <FollowButton userId={userId} />
    </div>
  );
}
