import "dotenv/config";
import { prisma } from "../src/server/db/client";
import { type Prisma } from "@prisma/client";
import { randInt, randomDate, randomText, randUniqueInts, uniqueWords } from "./lorem";

const N_USERS = 10;
const N_TWEETS_PER_USER = 5;
const N_TWEETREPLIES_PER_USER = 40;
const N_TWEETLIKES_PER_USER = 200;
const N_RETWEETS_PER_USER = 50;

type Users = Prisma.UserCreateManyInput[];
type UserBios = Prisma.UserBioCreateManyInput[];
type UserHandles = Prisma.UserHandleCreateManyInput[];
type Tweets = Prisma.TweetCreateManyInput[];
type TweetLikes = Prisma.TweetLikeCreateManyInput[];
type Retweets = Prisma.RetweetCreateManyInput[];

async function createUsers() {
  const users: Users = [];
  for (let i = 0; i < N_USERS; i++) {
    users.push({
      name: `seeduser${i}`,
      email: `seeduser${i}@some.org`,
      //image: "https://randomsvgface.andyfx.net",
      image: `/seeduser/avatar${i}.svg`,
    });
  }
  return await prisma.user.createMany({ data: users });
}

async function createBios() {
  const users = await prisma.user.findMany();
  const userBios: UserBios = users.map((user) => ({
    userId: user.id,
    text: randomText(),
  }));
  return await prisma.userBio.createMany({ data: userBios });
}

async function createHandles() {
  const users = await prisma.user.findMany();
  const names = uniqueWords(users.length);
  const handles: UserHandles = [];
  users.forEach((user, i) => {
    handles.push({
      userId: user.id,
      text: names[i]!,
    });
  });
  return await prisma.userHandle.createMany({ data: handles });
}

async function createTweets() {
  const users = await prisma.user.findMany();
  const tweets: Tweets = [];
  users.forEach((user) => {
    for (let i = 0; i < N_TWEETS_PER_USER; i++) {
      tweets.push({
        authorId: user.id,
        text: randomText(),
        createdAt: randomDate(),
      });
    }
  });
  return await prisma.tweet.createMany({ data: tweets });
}

async function createTweetReplies() {
  const users = await prisma.user.findMany();
  const parentTweets = await prisma.tweet.findMany();

  const tweets: Tweets = [];
  users.forEach((user) => {
    for (let i = 0; i < N_TWEETREPLIES_PER_USER; i++) {
      const parentTweetId = parentTweets[randInt(parentTweets.length)]!.id;
      tweets.push({
        parentTweetId,
        authorId: user.id,
        text: randomText(),
        createdAt: randomDate(),
      });
    }
  });
  return await prisma.tweet.createMany({ data: tweets });
}

async function createTweetLikes() {
  const users = await prisma.user.findMany();
  const tweets = await prisma.tweet.findMany();

  const tweetLikes: TweetLikes = [];
  users.forEach((user) => {
    const userId = user.id;
    const indexes = randUniqueInts(tweets.length, N_TWEETLIKES_PER_USER);
    indexes.forEach((i) => {
      tweetLikes.push({
        userId,
        tweetId: tweets[i]!.id,
        createdAt: randomDate(),
      });
    });
  });
  return await prisma.tweetLike.createMany({ data: tweetLikes });
}

async function createRetweets() {
  const users = await prisma.user.findMany();
  const tweets = await prisma.tweet.findMany();

  const retweets: Retweets = [];
  users.forEach((user) => {
    const userId = user.id;
    const indexes = randUniqueInts(tweets.length, N_RETWEETS_PER_USER);
    indexes.forEach((i) => {
      retweets.push({
        userId,
        tweetId: tweets[i]!.id,
        createdAt: randomDate(),
        text: Math.random() < 0.8 ? undefined : randomText(), // no text means retweet, text means quotetweet
      });
    });
  });
  return await prisma.retweet.createMany({ data: retweets });
}

/**
 * must have "type": "module" in package.json
 * also see package.json script tsnode
 * ```sh
 * yarn tsnode ./scripts/gettargets.ts
 * ```
 */
async function main() {
  await createUsers();
  await createBios();
  await createHandles();
  await createTweets();

  await createTweetReplies();
  await createTweetReplies();

  await createTweetLikes();
  await createRetweets();
}

main();
