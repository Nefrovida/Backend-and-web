import { prisma } from "#/src/util/prisma";

export async function likeMessageModel(messageId: number, userId: string) {
  const alreadyLiked = await prisma.likes.findFirst({
    where: {
      message_id: messageId,
      user_id: userId,
    },
    select: {
      like_id: true,
    },
  });
  if (alreadyLiked) {
    return await prisma.likes.delete({
      where: {
        like_id: alreadyLiked.like_id,
      },
    });
  }
  return await prisma.likes.create({
    data: {
      message_id: messageId,
      user_id: userId,
    },
  });
}
