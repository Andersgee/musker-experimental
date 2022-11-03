import { type NextApiRequest, type NextApiResponse } from "next";

import { prisma } from "src/server/db/client";

const posts = async (req: NextApiRequest, res: NextApiResponse) => {
  const posts = await prisma.post.findMany();
  res.status(200).json(posts);
};

export default posts;
