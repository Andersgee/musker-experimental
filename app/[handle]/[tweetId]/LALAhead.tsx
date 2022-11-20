import type { Params } from "src/utils/param";
//import { prisma } from "src/server/db/client";
import { SEO } from "src/components/SEO";
import { numberFromHashidParam } from "src/utils/hashids";
//import { getTweet } from "./page";

type Props = {
  params?: Params;
};

export default async function Head({ params }: Props) {
  //{"handle":"anders","tweetId":"kQ20o"}
  const handle = params?.tweetId as string;
  const hashId = params?.tweetId as string;
  const tweetId = numberFromHashidParam(params?.tweetId);
  //const tweet = await getTweet(tweetId);

  /*
  if (!tweet) {
    return <></>;
  }
  */

  return (
    <SEO
      url={`/${handle}/${hashId}`}
      //title={`Musker - $${handle}`}
      title="Musker"
      description={`Tweet by ${handle}`}
      image={`/api/og/tweet&id=${tweetId}`}
    />
  );
}
