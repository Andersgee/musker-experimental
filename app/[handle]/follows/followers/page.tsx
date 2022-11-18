import { prisma } from "src/server/db/client";
import { Users } from "./Users";

type Params = Record<string, string | string[]>;

type Props = {
  params?: Params;
};

export default async function Page({ params }: Props) {
  const handle = params?.handle;
  if (typeof handle !== "string") {
    return <div>missing handle</div>;
  }

  const userHandle = await prisma.userHandle.findUnique({
    where: { text: handle },
  });
  if (!userHandle?.userId) {
    return null;
  }

  return <Users userId={userHandle.userId} />;
}
