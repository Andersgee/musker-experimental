import { useSession } from "next-auth/react";
import Link from "next/link";
import { NavLinks } from "./NavLinks";

type Props = {
  className?: string;
  children: React.ReactNode;
};

export function Layout({ children, className }: Props) {
  return (
    <div className="grid h-screen grid-rows-phone">
      <Header className="flex h-12 items-center justify-between bg-red-500" />
      <main className="overflow-y-scroll bg-green-500">{children}</main>
      <Nav className="h-12 bg-orange-500" />
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
      <NavLinks className="flex w-full content-center items-center " />
    </nav>
  );
}
