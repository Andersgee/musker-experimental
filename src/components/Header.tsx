"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Stars } from "src/icons/Stars";

type Props = {
  className?: string;
};

export function Header({ className }: Props) {
  //const { data: sessionData } = useSession();
  return (
    <div className={`bg-white ${className}`}>
      <header className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="ml-4 font-medium">Home</div>
        </div>
        <Link href="/settings" className="group p-2">
          <Stars className="h-7 w-7  group-hover:text-blue-500" />
        </Link>
      </header>
    </div>
  );
}
