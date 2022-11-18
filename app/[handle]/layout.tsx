import Link from "next/link";
import { FollowButton } from "src/components/FollowButton";
import { IconDate } from "src/icons/Date";
import { prisma } from "src/server/db/client";
import { ImgUser } from "src/ui/ImgUser";
import { format } from "date-fns";
import { ProfileNav } from "./ProfileNav";

type Params = Record<string, string | string[]>;

type Props = {
  children: React.ReactNode;
  params?: Params;
};

export default async function Layout({ children, params }: Props) {
  const handle = params?.handle;
  if (typeof handle !== "string") {
    return <div>missing handle</div>;
  }

  const userHandle = await prisma.userHandle.findUnique({
    where: { text: handle },
    include: {
      user: {
        include: {
          bio: true,
          _count: {
            select: {
              sentFollows: true,
              recievedFollows: true,
            },
          },
        },
      },
    },
  });

  if (!userHandle) {
    return <div>this user does not exist</div>;
  }

  const user = userHandle.user;
  const recievedFollowsCount = userHandle.user._count.recievedFollows;
  const sentFollowsCount = userHandle.user._count.sentFollows;

  return (
    <div>
      <div className="mx-2">
        <div className="flex items-baseline justify-between">
          <ImgUser className="h-28 w-28" href={`/${handle}`} alt={handle} image={user.image || ""} />
          <div>
            <FollowButton userId={user.id} />
          </div>
        </div>
        <h2>{handle}</h2>
        <p>user.bio: {user.bio?.text}</p>
        <div className="flex gap-3">
          <Link href={`/${handle}/following`}>{sentFollowsCount} following</Link>
          <Link href={`/${handle}/followers`}>{recievedFollowsCount} followers</Link>
        </div>
        <span className="flex items-center text-sm">
          <IconDate className="h-5 w-5" />
          Joined {format(user.createdAt, "MMMM yyyy")}
        </span>
      </div>
      <ProfileNav handle={handle} />
      {children}
    </div>
  );
}
