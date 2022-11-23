import { Tweets } from "./Tweets";
import type { Params } from "src/utils/param";
import { getUserByHandle } from "src/utils/prisma";

export const preferredRegion = "home";
export const revalidate = 60;

type Props = {
  params?: Params;
};

export default async function Page({ params }: Props) {
  const handle = params?.handle as string;
  const user = await getUserByHandle(handle);
  if (!user) {
    //empty fragment not allowed
    return <div>no user here</div>;
  }

  return <Tweets userId={user.id} />;
}
