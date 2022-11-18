import { type inferAsyncReturnType } from "@trpc/server";
import { CreateReplyTweet } from "./CreateReplyTweet";
import { prisma } from "src/server/db/client";
import { TweetRSC } from "./TweetRSC";
import { Tweets } from "./Tweets";
import { numberFromHashidParam } from "src/utils/hashids";
import { redirect } from "next/navigation";

type Params = Record<string, string | string[]>;

export type Tweet = NonNullable<inferAsyncReturnType<typeof getTweet>>;

export async function getTweet(id: number | null | undefined) {
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

type Props = {
  params?: Params;
  searchParams?: Params;
};

export default async function Page({ params }: Props) {
  const pageTweetId = numberFromHashidParam(params?.tweetId);
  if (!pageTweetId) {
    //https://beta.nextjs.org/docs/api-reference/redirect
    redirect("/"); //does not actually redirect? just triggers the error page?
  }

  //walk upward parent chain and grab all tweets
  //since this is server component and cached, load is instant for client
  //except for very first page visit? hmm
  const tweets: Tweet[] = [];
  let tweetId: number | null | undefined = pageTweetId;
  while (tweetId) {
    const tweet: Tweet | null = await getTweet(tweetId);
    tweetId = tweet?.repliedToTweetId;
    if (tweet) {
      tweets.push(tweet);
    }
  }

  return (
    <div>
      <div>params: {JSON.stringify(params)}</div>
      {tweets.reverse().map((t) => (
        <TweetRSC key={t.id} tweet={t} />
      ))}
      <CreateReplyTweet tweetId={pageTweetId} />
      <Tweets tweetId={pageTweetId} />
    </div>
  );
}
