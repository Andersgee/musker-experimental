"use client";

import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";

type Props = {
  handle: string;
};

export function ProfileNav({ handle }: Props) {
  const segment = useSelectedLayoutSegment();
  return (
    <div className="mt-4 mb-6 flex justify-evenly">
      <NavLink href={`/${handle}`} active={segment === null}>
        Tweets
      </NavLink>
      <NavLink href={`/${handle}/with_replies`} active={segment === "with_replies"}>
        Tweets & replies
      </NavLink>
      <NavLink href={`/${handle}/likes`} active={segment === "likes"}>
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
      className={`flex-1 px-3 py-2 text-center hover:bg-neutral-100 dark:hover:bg-neutral-800 ${
        active ? "border-b-2 border-blue-500 text-black dark:text-white" : "text-neutral-700 dark:text-neutral-300"
      }`}
      href={href}
    >
      {children}
    </Link>
  );
}
