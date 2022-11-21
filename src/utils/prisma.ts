import { prisma } from "src/server/db/client";

export async function getUserByHandle(handle: string) {
  return await prisma.user.findUnique({
    where: { handle: handle },
  });
}

export async function getUserByHandleWithFollowCount(handle: string) {
  return await prisma.user.findUnique({
    where: { handle: handle },
    include: {
      bio: true,
      _count: {
        select: {
          sentFollows: true,
          recievedFollows: true,
        },
      },
    },
  });
}
