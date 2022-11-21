import Link from "next/link";
import { FollowButton } from "src/components/FollowButton";
import { IconDate } from "src/icons/Date";
import { ImgUser } from "src/ui/ImgUser";
import { format } from "date-fns";
import { ProfileNav } from "./ProfileNav";
import { getUserByHandleWithFollowCount } from "src/utils/prisma";
import type { Params } from "src/utils/param";

type Props = {
  children: React.ReactNode;
  params?: Params;
};

export default async function Layout({ children, params }: Props) {
  const handle = params?.handle as string;
  const user = await getUserByHandleWithFollowCount(handle);

  if (!user) {
    return null;
  }

  const recievedFollowsCount = user._count.recievedFollows;
  const sentFollowsCount = user._count.sentFollows;

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
          <Link href={`/${handle}/follows/following`}>{sentFollowsCount} following</Link>
          <Link href={`/${handle}/follows/followers`}>{recievedFollowsCount} followers</Link>
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
