import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user?: {
      id: string;
      //handle?: string;
    } & DefaultSession["user"];
  }

  /*
  interface User {
    handle?: string;
  }
  */
}

/*
notes to self, next-auth has default like this:

interface User extends Record<string, unknown>, DefaultUser {}
interface Session extends Record<string, unknown>, DefaultSession {}

where

interface DefaultUser {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
}

and 

interface DefaultSession extends Record<string, unknown> {
  user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
  };
  expires: ISODateString;
}


so for my usecase:
1. put intId and id on Session
2. put intId on User (DefaultUser already has id)
3. This obvisouly assumes we added an "intId Int" on the User model in prisma.schema
*/
