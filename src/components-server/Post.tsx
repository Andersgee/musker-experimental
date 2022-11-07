import { ImgUser } from "src/ui/ImgUser";
import { prisma } from "src/server/db/client";
//import { env } from "src/env/server.mjs";
//import { use } from "react";

type Props = {
  postId: string;
  className?: string;
};

// Ok... These server components _CAN NOT_ be imported and used in client components.
// But they _CAN_ be passed as child or prop to a client component
// @see https://beta.nextjs.org/docs/rendering/server-and-client-components#

export function Post({ postId }: Props) {
  console.log("hello?");
  //console.log({ env });
  /*
  const post = prisma.post.findUnique({
    where: { id: postId },
    include: {
      author: {
        select: {
          handle: true,
          image: true,
          name: true,
        },
      },
    },
  });
  */

  return <div>postId: {postId}</div>;

  /*
  if (!post) {
    return <div>no post here</div>;
  }

  return (
    <article className="flex">
      <div>
        <ImgUser
          href={`/u/${post.author.handle}`}
          image={post.author.image || ""}
          alt={post.author.handle || post.author.name || ""}
        />
      </div>
      <p>{post.text}</p>
    </article>
  );
  */
}
