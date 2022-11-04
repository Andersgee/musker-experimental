import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const hello = trpc.post.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <Head>
        <title>Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <p>Home</p>
      <AuthShowcase />
    </>
  );
};

export default Home;

function AuthShowcase() {
  const { data: secretMessage } = trpc.auth.getSecretMessage.useQuery();

  const { data: sessionData } = useSession();

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      {sessionData && <p className="">Logged in as {sessionData?.user?.name}</p>}
      {secretMessage && <p className="">{secretMessage}</p>}
      <button className="border border-black" onClick={sessionData ? () => signOut() : () => signIn()}>
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
}
