import { Client } from "@planetscale/database";
import type { User } from "@prisma/client";
//import { fetch } from "undici";

/*
maybe do this instead? but is it edge compat?
https://create.t3.gg/en/usage/trpc#expose-a-single-procedure-externally

BTW:
vercel/og stuff only supported "experimental-edge" 
(not in default Node.js runtime aka normal serverless function)
https://vercel.com/docs/concepts/functions/edge-functions/og-image-generation#requirements
*/

/*
planetscale has an edge compatible driver (aka fetch compatible)
see
https://github.com/planetscale/f1-championship-stats
https://github.com/planetscale/database-js

is there a way to test this locally?
*/

//https://vercel.com/docs/concepts/edge-network/regions#setting-edge-function-regions
//https://vercel.com/docs/concepts/edge-network/regions#region-list
export const config = {
  runtime: "experimental-edge", // this is a pre-requisite
  regions: "iad1", // only execute this function on iad1
};

const client = new Client({
  //fetch,
  url: process.env.DATABASE_URL,
});

//SELECT * FROM Tweet JOIN User ON User.id = Tweet.authorId WHERE Tweet.id = 3;

export default async function handler(req: Request) {
  try {
    const conn = client.connection();
    console.log("conn:", conn);
    const { rows } = await conn.execute("SELECT * FROM User WHERE id = 'clasievrq0007uiyiss0s0mde';");
    const user = rows[0] as User;
    console.log("user:", user);

    const json = JSON.stringify({ hello: "world" });

    return new Response(json, {
      headers: {
        "content-type": "application/json;charset=UTF-8",
        "access-control-allow-origin": "*",
      },
    });
  } catch {
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
