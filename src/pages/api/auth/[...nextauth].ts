import NextAuth, { type NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "src/server/db/client";
import { env } from "src/env/server.mjs";

export const authOptions: NextAuthOptions = {
  pages: {
    //signIn: "/sign-in",
  },

  callbacks: {
    session({ session, user }) {
      //Include id and intId on session.user
      //see types/next-auth.d.ts
      if (session.user) {
        session.user.id = user.id; //
        //session.user.intId = user.intId;
      }
      return session;
    },
    redirect({ url, baseUrl }) {
      if (url.startsWith("/")) {
        // Allows relative callback URLs
        return `${baseUrl}${url}`;
      } else if (new URL(url).origin === baseUrl) {
        // Allows callback URLs on the same origin
        return url;
      } else {
        return baseUrl;
      }
    },
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),
    GithubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }),
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    // ...add more providers here
  ],
};

export default NextAuth(authOptions);
