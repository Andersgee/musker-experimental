import { Client } from "@planetscale/database";
import type { User } from "@prisma/client";
//import { fetch } from "undici";

/*
planetscale has an edge compatible driver (aka fetch compatible)
see
https://github.com/planetscale/f1-championship-stats
https://github.com/planetscale/database-js

is there a way to test this locally?
*/

export const config = {
  runtime: "experimental-edge",
};

const client = new Client({
  //fetch,
  url: process.env.DATABASE_URL,
});

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
