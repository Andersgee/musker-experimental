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
      className="container grid grid-rows-phone 
     sm:grid-cols-sm sm:grid-rows-sm 
     md:grid-cols-md md:grid-rows-md 
     lg:grid-cols-lg lg:grid-rows-lg
    "
    >
      <Header className="headercontainer fixed h-12 bg-yellow-300 sm:ml-16 md:bg-blue-300 lg:ml-72 lg:bg-orange-300" />
      <main className="headercontainer row-start-2 sm:col-start-2 sm:row-start-1">{children}</main>
      <Nav className="fixed bottom-0 h-12 w-full bg-red-300 sm:h-full sm:w-16 lg:w-72" />
      <aside className="hidden h-96 bg-red-500 md:col-start-3 md:row-span-2 md:row-start-1 md:block ">aside</aside>
    </div>
  );
}

function Header({ className }: { className?: string }) {
  const { data: sessionData } = useSession();
  return (
    <div className={className}>
      <header className="flex items-center justify-between">
        <div className="flex items-center">
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
    </div>
  );
}

function Nav({ className }: { className?: string }) {
  return (
    <nav className={className}>
      <NavLinks className="flex items-center bg-red-500 sm:flex-col lg:items-start" />
    </nav>
  );
}
