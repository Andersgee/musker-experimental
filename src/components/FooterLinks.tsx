import Link from "next/link";
import React from "react";
import { IconExplore } from "src/icons/Explore";
import { IconHome } from "src/icons/Home";
import { IconMessages } from "src/icons/Messages";
import { IconNotifications } from "src/icons/Notifications";

export function FooterLinks() {
  return (
    <footer className="flex w-full content-center items-center bg-white">
      <NavLink href="/home">
        <IconHome className="h-7 w-7 text-black group-hover:text-blue-500" />
      </NavLink>
      <NavLink href="/explore">
        <IconExplore className="h-7 w-7 text-black group-hover:text-blue-500" />
      </NavLink>
      <NavLink href="/notifications">
        <IconNotifications className="h-7 w-7 text-black group-hover:text-blue-500" />
      </NavLink>
      <NavLink href="/messages">
        <IconMessages className="h-7 w-7 text-black group-hover:text-blue-500" />
      </NavLink>
    </footer>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="group flex h-12 flex-1 items-center justify-center ">
      {children}
    </Link>
  );
}
