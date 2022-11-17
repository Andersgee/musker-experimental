import { type inferAsyncReturnType } from "@trpc/server";
import { ComposeReply } from "./ComposeReply";
import { prisma } from "src/server/db/client";
import { TweetRSC } from "./TweetRSC";
import { Tweets } from "./Tweets";

type Params = Record<string, string | string[]>;

type Props = {
  params?: Params;
  searchParams?: Params;
};

export type Tweet = NonNullable<inferAsyncReturnType<typeof getTweet>>;

export async function getTweet(id: string | null | undefined) {
  if (!id) return null;
  return prisma.tweet.findUnique({
    where: { id },
    include: {
      author: {
        include: { handle: true },
      },
      _count: {
        select: { replies: true, retweets: true, likes: true },
      },
    },
  });
}

export default async function Page({ params }: Props) {
  const pageTweetId = params?.tweetId;
  if (typeof pageTweetId !== "string") {
    return <div>missing tweetId</div>;
  }

  //walk upward parent chain and grab all tweets
  //since this is server component and cached, load is instant for client
  //except for very first page visit? hmm
  const tweets: Tweet[] = [];
  let tweetId: string | null | undefined = pageTweetId;
  while (tweetId) {
    const tweet: Tweet | null = await getTweet(tweetId);
    tweetId = tweet?.repliedToTweetId;
    if (tweet) {
      tweets.push(tweet);
    }
  }

  return (
    <div>
      {tweets.reverse().map((t) => (
        <TweetRSC key={t.id} tweet={t} />
      ))}
      <ComposeReply tweetId={pageTweetId} />
      <Tweets tweetId={pageTweetId} />
    </div>
  );
}
