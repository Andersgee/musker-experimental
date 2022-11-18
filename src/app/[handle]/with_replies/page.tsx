import { prisma } from "src/server/db/client";

type Params = Record<string, string | string[]>;

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

  //return <Likes userId={userHandle.userId} userHandle={handle} />;
  return <div>with_replies</div>;
}
