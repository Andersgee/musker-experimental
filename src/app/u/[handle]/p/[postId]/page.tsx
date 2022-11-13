import { prisma } from "src/server/db/client";
/*
import Link from "next/link";
import { FollowButton } from "src/components/FollowButton";
import { IconDate } from "src/icons/Date";
import { ImgUser } from "src/ui/ImgUser";
import { format } from "date-fns";

*/
import { Post } from "src/components-server/Post";

type Params = Record<string, string | string[]>;

type Props = {
  params?: Params;
  searchParams?: Params;
};

export default async function Page({ params }: Props) {
  const postId = params?.postId;
  if (typeof postId !== "string") {
    return <div>missing postId</div>;
  }

  const post = await prisma.tweet.findUnique({
    where: { id: postId },
    include: { author: { include: { handle: true } } },
  });

  if (!post) {
    return <div>this post does not exist</div>;
  }

  return <Post post={post} />;
}
