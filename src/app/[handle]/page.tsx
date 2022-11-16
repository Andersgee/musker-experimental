import Link from "next/link";
import { FollowButton } from "src/components/FollowButton";
import { IconDate } from "src/icons/Date";
import { prisma } from "src/server/db/client";
import { ImgUser } from "src/ui/ImgUser";
import { format } from "date-fns";
import { Tweets } from "./Tweets";

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
          <ImgUser
            className="h-28 w-28"
            href={`/${userHandle.text}`}
            alt={userHandle.text || user.name || ""}
            image={user.image || ""}
          />
          <div>
            <FollowButton userId={user.id} />
          </div>
        </div>
        <h2>{userHandle.text}</h2>
        <p>user.bio: {user.bio?.text}</p>
        <div className="flex gap-3">
          <Link href={`/${userHandle.text}/following`}>{sentFollowsCount} following</Link>
          <Link href={`/${userHandle.text}/followers`}>{recievedFollowsCount} followers</Link>
        </div>
        <span className="flex items-center text-sm">
          <IconDate className="h-5 w-5" />
          Joined {format(user.createdAt, "MMMM yyyy")}
        </span>
      </div>

      <Tweets userId={user.id} />
    </div>
  );
}
