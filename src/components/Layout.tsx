import { useSession } from "next-auth/react";
import Link from "next/link";
import { NavLinks } from "./NavLinks";

type Props = {
  className?: string;
  children: React.ReactNode;
};

export function Layout({ children, className }: Props) {
  return (
    <div
      className="container grid h-screen 
    grid-rows-phone sm:grid-cols-sm
    sm:grid-rows-sm md:grid-cols-md
    md:grid-rows-md lg:grid-cols-lg
    lg:grid-rows-lg
    "
    >
      <Header className="flex h-12 items-center justify-between bg-red-500 sm:col-span-1 sm:col-start-2" />
      <main className="overflow-y-scroll bg-green-500 sm:col-span-1 sm:col-start-2 sm:bg-cyan-500 md:bg-purple-500 lg:bg-green-500">
        {children}
      </main>
      <Nav className="h-12 bg-orange-500 sm:col-span-1 sm:col-start-1 sm:row-span-2 sm:row-start-1 sm:h-full" />
      <aside className="hidden md:col-start-3 md:row-start-1 md:block">aside</aside>
    </div>
  );
}

function Header({ className }: { className?: string }) {
  const { data: sessionData } = useSession();
  return (
    <header className={className}>
      <div className="flex">
        <Link href="/userhandle" className="flex w-12 items-center justify-center">
          <img
            className="h-8 w-8 rounded-full shadow-imageborder"
            src={sessionData?.user?.image || undefined}
            alt={sessionData?.user?.handle || sessionData?.user?.name || undefined}
          />
        </Link>
        <div className="ml-4 font-medium">Home</div>
      </div>
      <Link href="/preferences" className="flex w-12 items-center justify-center">
        <div className="h-8 w-8">pref</div>
      </Link>
    </header>
  );
}

function Nav({ className }: { className?: string }) {
  return (
    <nav className={className}>
      <NavLinks className="flex items-center bg-red-500 sm:flex-col lg:items-start" />
    </nav>
  );
}
