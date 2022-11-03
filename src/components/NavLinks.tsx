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
      <li className="w-full flex-1">
        <NavLink href="/" label="Home">
          <IconHome className="h-7 w-7 text-black group-hover:text-blue-500" />
        </NavLink>
      </li>
      <li className="w-full flex-1">
        <NavLink href="/explore" label="Explore">
          <IconExplore className="h-7 w-7 text-black group-hover:text-blue-500" />
        </NavLink>
      </li>
      <li className="w-full flex-1">
        <NavLink href="/notifications" label="Notifications">
          <IconNotifications className="h-7 w-7 text-black group-hover:text-blue-500" />
        </NavLink>
      </li>
      <li className="w-full flex-1">
        <NavLink href="/messages" label="Messages">
          <IconMessages className="h-7 w-7 text-black group-hover:text-blue-500" />
        </NavLink>
      </li>
    </ul>
  );
}

function NavLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="group flex h-12 items-center justify-center bg-purple-500 lg:justify-start lg:pl-8">
      {children}
      <span className="hidden lg:block">{label}</span>
    </Link>
  );
}
