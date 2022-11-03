import Link from "next/link";
import { FooterLinks } from "./FooterLinks";

type Props = {
  className?: string;
  children: React.ReactNode;
};

export function Layout({ children, className }: Props) {
  return (
    <div className="flex h-screen flex-col">
      <header className="flex h-12 w-full content-center items-center">
        <Link href="/userhandle" className="flex h-full w-12 items-center justify-center">
          img
        </Link>
        <div className="ml-4 flex-1 font-medium">Home</div>
        <Link href="/preferences" className="flex h-full w-12 items-center justify-center">
          <div className="h-8 w-8">pref</div>
        </Link>
      </header>
      <main className="flex-1 overflow-y-scroll">{children}</main>
      <FooterLinks />
    </div>
  );
}
