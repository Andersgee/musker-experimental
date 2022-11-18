"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  handle: string;
};

export function ProfileNav({ handle }: Props) {
  const pathname = usePathname();
  const isOnTweets = pathname?.endsWith(handle);
  const isOnLikes = pathname?.endsWith("likes");
  return (
    <div className="flex justify-evenly">
      <NavLink href={`/${handle}`} active={isOnTweets}>
        Tweets
      </NavLink>
      <NavLink href={`/${handle}/with_replies`} active={false}>
        Tweets & replies
      </NavLink>
      <NavLink href={`/${handle}/likes`} active={isOnLikes}>
        Likes
      </NavLink>
    </div>
  );
}

type NavLinkProps = {
  href: string;
  children: React.ReactNode;
  active?: boolean;
};

function NavLink({ href, active = false, children }: NavLinkProps) {
  return (
    <Link
      className={`px-3 py-2 ${
        active ? "border-b-2 border-blue-500 text-black dark:text-white" : "text-neutral-700 dark:text-neutral-300"
      }`}
      href={href}
    >
      {children}
    </Link>
  );
}
