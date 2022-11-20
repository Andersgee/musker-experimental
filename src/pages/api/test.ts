import { Client } from "@planetscale/database";
import { fetch } from "undici";

export const config = {
  fetch,
  runtime: "experimental-edge",
};

const db = new Client({
  url: process.env.DATABASE_URL,
});

export default async function handler(req: Request) {
  console.log("HANDLER IS HERE");
  const conn = db.connection();
  const results = await conn.execute("select 1 from User");
  console.log({ results });

  //const json = JSON.stringify(results);

  return new Response('{"hello":"world"}', {
    headers: {
      "content-type": "application/json;charset=UTF-8",
      "access-control-allow-origin": "*",
    },
  });
}
