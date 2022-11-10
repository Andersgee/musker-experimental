import Link from "next/link";
import { FollowButton } from "src/components/FollowButton";
import { IconDate } from "src/icons/Date";
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

  const followers = await prisma.follow.aggregate({
    where: { userId: user?.id },
    _count: {
      _all: true,
    },
  });

  const following = await prisma.follow.aggregate({
    where: { followerId: user?.id },
    _count: {
      _all: true,
    },
  });

  if (!user) {
    return <div>this user does not exist</div>;
  }

  return (
    <div className="mx-2">
      <div className="flex items-baseline justify-between">
        <ImgUser
          className="h-28 w-28"
          href={`/u/${user.handle}`}
          alt={user.handle || user.name || ""}
          image={user.image || ""}
        />
        <div>
          <FollowButton userId={user.id} />
        </div>
      </div>
      <h2>{user.handle || user.name}</h2>
      <p>user.bio: {user.bio}</p>
      <div className="flex gap-3">
        <Link href={`/u/${user.handle}/following`}>{following._count._all} following</Link>
        <Link href={`/u/${user.handle}/followers`}>{followers._count._all} followers</Link>
      </div>
      <span className="flex items-center">
        <IconDate className="h-5 w-5" />
        joined: user.createdAt
      </span>
    </div>
  );
}
