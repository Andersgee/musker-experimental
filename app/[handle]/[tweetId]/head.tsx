import type { Params } from "src/utils/param";
//import { prisma } from "src/server/db/client";
import { SEO } from "src/components/SEO";
//import { numberFromHashidParam } from "src/utils/hashids";

type Props = {
  params?: Params;
};

export default async function Head({ params }: Props) {
  const handle = params?.handle as string;
  const hashId = params?.tweetId as string;

  /*
  const tweetId = numberFromHashidParam(params?.tweetId);
  //const tweet = await getTweet(tweetId);

  if (!tweetId) {
    return (
      <>
        <title>Musker</title>
      </>
    );
  }
*/
  return (
    <SEO
      title="Musker"
      url={`/${handle}/${hashId}`}
      description={`Tweet by ${handle}`}
      image={`/api/og/tweet&hashId=${hashId}`}
    />
  );
}
