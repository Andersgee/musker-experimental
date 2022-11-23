import { db } from "src/utils/kysely";
import type { Params } from "src/utils/param";
//import { getUserByHandle } from "src/utils/prisma";
import { Users } from "./Users";

export const preferredRegion = "home";
export const revalidate = 60;

type Props = {
  params?: Params;
};

export default async function Page({ params }: Props) {
  const handle = params?.handle as string;
  //const user = await getUserByHandle(handle);

  const user = await db.connection().execute((db) => {
    return db.selectFrom("User").where("User.handle", "=", handle).selectAll().executeTakeFirst();
  });

  if (!user) {
    return null;
  }
  return <Users userId={user.id} />;
}
