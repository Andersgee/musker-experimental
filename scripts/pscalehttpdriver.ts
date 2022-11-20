import "dotenv/config";
import { Client } from "@planetscale/database";

const client = new Client({
  host: process.env.DATABASE_URL,
});

const conn = client.connection();
const results = await conn.execute("select 1 from tweet");
console.log(results);
