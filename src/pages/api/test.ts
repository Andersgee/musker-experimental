import { Client } from "@planetscale/database";
//import { fetch } from "undici";

export const config = {
  runtime: "experimental-edge",
};

const client = new Client({
  //fetch,
  url: process.env.DATABASE_URL,
});

export default async function handler(req: Request) {
  console.log("HANDLER IS HERE");
  console.log("process.env.DATABASE_URL", process.env.DATABASE_URL);
  const conn = client.connection();
  console.log("conn:", conn);
  const results = await conn.execute("select * from User");
  console.log({ results });

  //const json = JSON.stringify(results);

  return new Response('{"hello":"world"}', {
    headers: {
      "content-type": "application/json;charset=UTF-8",
      "access-control-allow-origin": "*",
    },
  });
}
