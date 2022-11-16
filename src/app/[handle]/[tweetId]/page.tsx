import { prisma } from "src/server/db/client";
import { TweetRSC } from "src/components/TweetRSC";
import { TweetComposeReply } from "src/components/TweetComposeReply";
import { tweetInclude } from "src/server/trpc/router/tweet";

type Params = Record<string, string | string[]>;

type Props = {
  params?: Params;
  searchParams?: Params;
};

export default async function Page({ params }: Props) {
  const tweetId = params?.tweetId;
  if (typeof tweetId !== "string") {
    return <div>missing tweetId</div>;
  }

  const tweet = await prisma.tweet.findUnique({
    where: { id: tweetId },
    include: tweetInclude,
  });

  if (!tweet) {
    return <div>this tweet does not exist</div>;
  }

  return (
    <div>
      {tweet.parentTweet && <TweetRSC tweet={tweet.parentTweet} showReplyLine={!!tweet.parentTweet} />}
      <TweetRSC tweet={tweet} />
      <TweetComposeReply tweetId={tweet.id} tweetAuthor={tweet.author.handle?.text} />

      <div>tweetreplies for tweet.id:{tweet.id}</div>
    </div>
  );
}
