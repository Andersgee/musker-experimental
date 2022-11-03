import Link from "next/link";
import React from "react";
import { IconExplore } from "src/icons/Explore";
import { IconHome } from "src/icons/Home";
import { IconMessages } from "src/icons/Messages";
import { IconNotifications } from "src/icons/Notifications";

type Props = {
  className?: string;
};

export function NavLinks({ className }: Props) {
  return (
    <ul className={className}>
      <li className="flex-1">
        <NavLink href="/">
          <IconHome className="h-7 w-7 text-black group-hover:text-blue-500" />
        </NavLink>
      </li>
      <li className="flex-1">
        <NavLink href="/explore">
          <IconExplore className="h-7 w-7 text-black group-hover:text-blue-500" />
        </NavLink>
      </li>
      <li className="flex-1">
        <NavLink href="/notifications">
          <IconNotifications className="h-7 w-7 text-black group-hover:text-blue-500" />
        </NavLink>
      </li>
      <li className="flex-1">
        <NavLink href="/messages">
          <IconMessages className="h-7 w-7 text-black group-hover:text-blue-500" />
        </NavLink>
      </li>
    </ul>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="group flex h-12 items-center justify-center">
      {children}
    </Link>
  );
}
