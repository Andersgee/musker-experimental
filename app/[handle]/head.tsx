import type { Params } from "src/utils/param";
import { absUrl, SEO } from "src/components/SEO";
import { getUserByHandle } from "src/utils/prisma";

type Props = {
  params?: Params;
};

export default async function Head({ params }: Props) {
  const handle = params?.handle as string;
  const user = await getUserByHandle(handle);
  if (!user) {
    return <></>;
  }

  const image = absUrl(user.image || undefined); //needed only for seedusers which uses relative urls

  return (
    <SEO
      url={`/${handle}`}
      title="Musker"
      description={`profile page of ${handle}`}
      image={`/api/og/profile&handle=${handle}&image=${image}`}
    />
  );
}
