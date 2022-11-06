import { FollowButton } from "src/components/FollowButton";
import { prisma } from "src/server/db/client";
import { ImgUser } from "src/ui/ImgUser";

type Params = Record<string, string | string[]>;

type Props = {
  params?: Params;
  searchParams?: Params;
};

export default async function Page({ params }: Props) {
  const handle = params?.handle;
  if (typeof handle !== "string") {
    return <div>missing handle</div>;
  }

  const user = await prisma.user.findFirst({ where: { handle: handle } });
  if (!user) {
    return <div>this user does not exist</div>;
  }

  return (
    <div>
      <div className="flex">
        <ImgUser href={`/u/${user.handle}`} alt={user.handle || user.name || ""} image={user.image || ""} />
        <h2>{user.handle || user.name}</h2>
        <FollowButton userId={user.id} />
      </div>
      <div>params: {JSON.stringify(params)}</div>
      <div>user: {JSON.stringify(user)}</div>
    </div>
  );
}
