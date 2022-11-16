import { type inferAsyncReturnType } from "@trpc/server";
import { prisma } from "src/server/db/client";
import { TweetRSC } from "./TweetRSC";
//import { TweetRSC } from "src/components/TweetRSC";
//import { TweetComposeReply } from "src/components/TweetComposeReply";

type Params = Record<string, string | string[]>;

type Props = {
  params?: Params;
  searchParams?: Params;
};

export type Tweet = NonNullable<inferAsyncReturnType<typeof getTweet>>;

export async function getTweet(id: string) {
  return prisma.tweet.findUnique({
    where: { id },
    include: {
      author: {
        include: { handle: true },
      },
      _count: {
        select: { childTweets: true, tweetLikes: true, retweets: true },
      },
      parentTweet: {
        select: {
          id: true,
        },
      },
    },
  });
}

export default async function Page({ params }: Props) {
  const pageTweetId = params?.tweetId;
  if (typeof pageTweetId !== "string") {
    return <div>missing tweetId</div>;
  }

  //grab all tweets upward parent chain
  const tweets: Tweet[] = [];
  let tweetId = pageTweetId;
  let hasParent = true;
  while (hasParent) {
    const tweet = await getTweet(tweetId);
    if (tweet) [tweets.push(tweet)];

    if (tweet?.parentTweetId) {
      tweetId = tweet.parentTweetId;
    } else {
      hasParent = false;
    }
  }

  return (
    <div>
      {tweets.reverse().map((t) => (
        <TweetRSC key={t.id} tweet={t} />
      ))}
    </div>
  );
}
