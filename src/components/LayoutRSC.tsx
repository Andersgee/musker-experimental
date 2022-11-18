import { HeaderRSC } from "./HeaderRSC";
import { NavRSC } from "./NavRSC";

type Props = {
  className?: string;
  children: React.ReactNode;
};

export function LayoutRSC({ children }: Props) {
  return (
    <div
      className="container grid grid-rows-phone 
     sm:grid-cols-sm sm:grid-rows-sm 
     md:grid-cols-md md:grid-rows-md
     lg:grid-cols-lg lg:grid-rows-lg
    "
    >
      <NavRSC className="fixed bottom-0 h-12 w-full border-t sm:h-full sm:w-16 sm:border-t-0 lg:w-72" />
      <HeaderRSC className="headercontainer fixed h-12 sm:ml-16 lg:ml-72" />
      <main className="headercontainer row-start-2 sm:col-start-2">{children}</main>
      <aside className="hidden  md:col-start-3 md:row-span-2 md:row-start-1 md:block">
        <article className="mx-2 mt-1">
          <h2>What is this?</h2>
          <p>
            Musker is a twitter clone built with the latest (experimental) features of nextjs 13 such as server
            components and more.
          </p>
        </article>
      </aside>
    </div>
  );
}
