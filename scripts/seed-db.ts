import "dotenv/config";
import { prisma } from "../src/server/db/client";
import { type Prisma } from "@prisma/client";
import { randomText, uniqueWords } from "./lorem";

const N_USERS = 10;
const N_POSTS_PER_USER = 20;

type Users = Prisma.UserCreateManyInput[];
type UserBios = Prisma.UserBioCreateManyInput[];
type UserHandles = Prisma.UserHandleCreateManyInput[];
type Posts = Prisma.PostCreateManyInput[];

function createUsers() {
  const users: Users = [];
  for (let i = 0; i < N_USERS; i++) {
    users.push({
      id: `seeduser${i}`, //assign id manually
      name: `seeduser${i}`,
      email: `seeduser${i}@some.org`,
      image: "https://randomsvgface.andyfx.net",
    });
  }
  return users;
}

function createBios(users: Users) {
  const bios: UserBios = users.map((user) => ({
    userId: user.id!,
    text: randomText(),
  }));
  console.log({ bios });
  return bios;
}

function createHandles(users: Users) {
  const names = uniqueWords(users.length);
  const handles: UserHandles = [];
  users.forEach((user, i) => {
    handles.push({
      userId: user.id!,
      text: names[i]!,
    });
  });
  return handles;
}

function createPosts(users: Users) {
  const posts: Posts = [];
  users.forEach((user) => {
    for (let i = 0; i < N_POSTS_PER_USER; i++) {
      posts.push({
        authorId: user.id!,
        text: randomText(),
      });
    }
  });
  return posts;
}

/**
 * must have "type": "module" in package.json
 * also see package.json script tsnode
 * ```sh
 * yarn tsnode ./scripts/gettargets.ts
 * ```
 */
async function main() {
  const users = createUsers();
  const userBios = createBios(users);
  const userHandles = createHandles(users);
  const posts = createPosts(users);

  await prisma.user.createMany({ data: users });
  await prisma.userBio.createMany({ data: userBios });
  await prisma.userHandle.createMany({ data: userHandles });
  await prisma.post.createMany({ data: posts });
}

main();
