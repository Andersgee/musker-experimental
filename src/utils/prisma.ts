import { prisma } from "src/server/db/client";

export async function getUserByHandle(handle: string) {
  if (!handle) return null;
  try {
    return await prisma.user.findUnique({
      where: { handle: handle },
    });
  } catch {
    return null;
  }
}

export async function getUserByHandleWithFollowCount(handle: string) {
  if (!handle) return null;
  try {
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
  } catch {
    return null;
  }
}
