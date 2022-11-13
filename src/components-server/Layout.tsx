import { Header } from "../components/Header";
import { Nav } from "../components/Nav";

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
      <Nav className="fixed bottom-0 h-12 w-full border-t sm:h-full sm:w-16 sm:border-t-0 lg:w-72" />
      <Header className="headercontainer fixed h-12 sm:ml-16 lg:ml-72" />
      <main className="headercontainer row-start-2 sm:col-start-2">{children}</main>
      <aside className="hidden  md:col-start-3 md:row-span-2 md:row-start-1 md:block">
        <article className="mx-2 mt-1">
          <h2>What is this?</h2>
          <p>Musker is a twitter clone built with experimental features of nextjs 13.</p>
          <p></p>
        </article>
      </aside>
    </div>
  );
}
