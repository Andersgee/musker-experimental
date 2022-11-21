import { type inferAsyncReturnType } from "@trpc/server";
import { CreateReplyTweet } from "./CreateReplyTweet";
import { prisma } from "src/server/db/client";
import { TweetRSC } from "./TweetRSC";
import { Tweets } from "./Tweets";
import { numberFromHashidParam } from "src/utils/hashids";
import type { Params } from "src/utils/param";
//import { redirect } from "next/navigation";

export type Tweet = NonNullable<inferAsyncReturnType<typeof getTweet>>;

export async function getTweet(id: number | null | undefined) {
  if (!id) return null;
  return prisma.tweet.findUnique({
    where: { id },
    select: {
      id: true,
      text: true,
      createdAt: true,
      repliedToTweetId: true,
      author: {
        select: {
          image: true,
          handle: true,
        },
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
    return <div>nothing to see here</div>;
    //https://beta.nextjs.org/docs/api-reference/redirect
    //redirect("/");
    //so that does not actually redirect?
    //it just errors without triggering error page?
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

  if (tweets.length < 1) {
    return <div>nothing to see here</div>;
  }

  return (
    <div>
      <div>{JSON.stringify(params)}</div>
      <div>pageTweetId: {pageTweetId}</div>
      {tweets.reverse().map((t) => (
        <TweetRSC key={t.id} tweet={t} />
      ))}
      <CreateReplyTweet tweetId={pageTweetId} />
      <Tweets tweetId={pageTweetId} />
    </div>
  );
}
