"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

type Props = {
  className?: string;
};

export function Header({ className }: Props) {
  const { data: sessionData } = useSession();
  return (
    <div className={`bg-white ${className}`}>
      <header className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="ml-4 font-medium">Home</div>
        </div>
        <Link href="/preferences" className="flex w-12 items-center justify-center">
          <div className="h-8 w-8">pref</div>
        </Link>
      </header>
    </div>
  );
}
