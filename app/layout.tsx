import "src/styles/globals.css";

//import { LayoutRSC } from "src/components/LayoutRSC";
import { TrpcProvider } from "src/contexts/TrpcContext";
import { SessionProvider } from "src/contexts/SessionContext";
import { ThemeProvider } from "src/contexts/next-themes";
import { Montserrat } from "@next/font/google";
import { DialogProvider } from "src/contexts/Dialog";
import { SignInDialog } from "src/components/SignInDialog";
import { NavRSC } from "src/components/NavRSC";
import { HeaderRSC } from "src/components/HeaderRSC";

//const montserrat = Montserrat({ weight: "variable", subsets: ["latin"] });

//https://beta.nextjs.org/docs/optimizing/fonts#with-tailwind-css
//const oswald = Oswald({ weight: "variable", subsets: ["latin"], variable: "--font-paragraph" });
const montserrat = Montserrat({ weight: "variable", subsets: ["latin"], variable: "--font-paragraph" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={montserrat.variable}>
      <SessionProvider>
        <TrpcProvider>
          <ThemeProvider>
            <DialogProvider>
              <body>
                <SignInDialog />
                <div className="container grid grid-rows-phone sm:grid-cols-sm sm:grid-rows-sm md:grid-cols-md md:grid-rows-md lg:grid-cols-lg lg:grid-rows-lg">
                  <NavRSC className="fixed bottom-0 h-12 w-full border-t sm:h-full sm:w-16 sm:border-t-0 lg:w-72" />
                  <HeaderRSC className="headercontainer fixed h-12 sm:ml-16 lg:ml-72" />
                  <main className="headercontainer row-start-2 sm:col-start-2">{children}</main>
                  <aside className="hidden  md:col-start-3 md:row-span-2 md:row-start-1 md:block">
                    <article className="mx-2 mt-1">
                      <h2>What is this?</h2>
                      <p>
                        Musker is a twitter clone built with the latest (experimental) features of nextjs 13 such as
                        server components and more.
                      </p>
                    </article>
                  </aside>
                </div>
              </body>
            </DialogProvider>
          </ThemeProvider>
        </TrpcProvider>
      </SessionProvider>
    </html>
  );
}
