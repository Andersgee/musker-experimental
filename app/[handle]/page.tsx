import { prisma } from "src/server/db/client";
import { Tweets } from "./Tweets";
import type { Params } from "src/utils/param";

type Props = {
  params?: Params;
};

export default async function Page({ params }: Props) {
  const handle = params?.handle as string;

  if (typeof handle !== "string") {
    return null;
  }

  const userHandle = await prisma.userHandle.findUnique({
    where: { text: handle },
  });
  if (!userHandle?.userId) {
    return null;
  }

  return <Tweets userId={userHandle.userId} />;
}
