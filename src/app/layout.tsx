import "src/styles/globals.css";

import { LayoutRSC } from "src/components/LayoutRSC";
import { TrpcProvider } from "src/contexts/TrpcContext";
import { SessionProvider } from "src/contexts/SessionContext";
import { ThemeProvider } from "src/contexts/next-themes";
import { Montserrat } from "@next/font/google";

//const montserrat = Montserrat({ weight: "variable", subsets: ["latin"] });

//https://beta.nextjs.org/docs/optimizing/fonts#with-tailwind-css
//const oswald = Oswald({ weight: "variable", subsets: ["latin"], variable: "--font-paragraph" });
const montserrat = Montserrat({ weight: "variable", subsets: ["latin"], variable: "--font-paragraph" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={montserrat.variable}>
      <head>
        <title>Musker</title>
        <meta name="description" content="musker" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <SessionProvider>
        <TrpcProvider>
          <ThemeProvider>
            <body>
              <LayoutRSC>{children}</LayoutRSC>
            </body>
          </ThemeProvider>
        </TrpcProvider>
      </SessionProvider>
    </html>
  );
}
