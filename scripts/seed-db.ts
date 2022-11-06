import "dotenv/config";
import { prisma } from "../src/server/db/client";
import { type Prisma } from "@prisma/client";
import { randomPostText } from "./lorem";

const seedUsers: Prisma.UserCreateManyArgs["data"] = [];
for (let i = 0; i < 10; i++) {
  seedUsers.push({
    id: `seeduser${i}`, //assign id manually
    name: `seeduser${i}`,
    handle: `seeduser${i}`,
    email: `seeduser${i}@some.org`,
  });
}

const seedPosts: Prisma.PostCreateManyArgs["data"] = [];
for (const user of seedUsers) {
  for (let i = 0; i < 100; i++) {
    seedPosts.push({
      authorId: user.id!,
      text: randomPostText(),
    });
  }
}

/**
 * must have "type": "module" in package.json
 * also see package.json script tsnode
 * ```sh
 * yarn tsnode ./scripts/gettargets.ts
 * ```
 */
async function main() {
  await prisma.user.createMany({ data: seedUsers });
  await prisma.post.createMany({ data: seedPosts });
}

main();
