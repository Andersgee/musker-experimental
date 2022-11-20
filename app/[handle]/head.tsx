import type { Params } from "src/utils/param";
import { prisma } from "src/server/db/client";
import { absUrl, SEO } from "src/components/SEO";

type Props = {
  params?: Params;
};

export default async function Head({ params }: Props) {
  const handle = params?.handle as string;
  const userHandle = await prisma.userHandle.findUnique({
    where: { text: handle },
    select: {
      user: {
        select: {
          image: true,
        },
      },
    },
  });
  if (!userHandle) {
    return <></>;
  }

  const image = absUrl(userHandle.user.image || undefined); //for seedusers

  return (
    <SEO
      url={`/${handle}`}
      title="Musker"
      description={`profile page of ${handle}`}
      image={`/api/og/profile&handle=${handle}&image=${image}`}
    />
  );
}
