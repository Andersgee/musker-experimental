import { getUserByHandle } from "src/utils/prisma";
import { Users } from "./Users";

export const preferredRegion = "home";
export const revalidate = 60;

type Params = Record<string, string | string[]>;

type Props = {
  params?: Params;
};

export default async function Page({ params }: Props) {
  const handle = params?.handle as string;
  const user = await getUserByHandle(handle);
  if (!user) {
    return null;
  }

  return <Users userId={user.id} />;
}
