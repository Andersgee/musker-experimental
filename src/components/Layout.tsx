import { Header } from "./Header";
import { Nav } from "./Nav";

type Props = {
  className?: string;
  children: React.ReactNode;
};

export function Layout({ children }: Props) {
  return (
    <div
      className="container grid grid-rows-phone 
     sm:grid-cols-sm sm:grid-rows-sm 
     md:grid-cols-md md:grid-rows-md
     lg:grid-cols-lg lg:grid-rows-lg
    "
    >
      <Header className="headercontainer fixed h-12 sm:ml-16 lg:ml-72" />
      <main className="headercontainer row-start-2 sm:col-start-2">{children}</main>
      <Nav className="fixed bottom-0 h-12 w-full border-t sm:h-full sm:w-16 sm:border-t-0 lg:w-72" />
      <aside className="hidden  md:col-start-3 md:row-span-2 md:row-start-1 md:block">aside</aside>
    </div>
  );
}
