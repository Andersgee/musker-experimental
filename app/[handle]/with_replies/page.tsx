import { Tweets } from "./Tweets";
import type { Params } from "src/utils/param";
import { getUserByHandle } from "src/utils/prisma";

type Props = {
  params?: Params;
};

export default async function Page({ params }: Props) {
  const handle = params?.handle as string;
  const user = await getUserByHandle(handle);
  if (!user) {
    return null;
  }

  return <Tweets userId={user.id} />;
}
