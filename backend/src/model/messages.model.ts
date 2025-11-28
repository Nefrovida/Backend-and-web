import { prisma } from '../util/prisma';

/**
 * Create a root message
 */
export const createMessage = async (forumId: number, userId: string, content: string) => {
  return await prisma.messages.create({
    data: {
      forum_id: forumId,
      user_id: userId,
      content,
    },
  });
};

/**
 * Create a response to the root message
 */
export const createReply = async (forumId: number, userId: string, parentMessageId: number, content: string) => {
  return await prisma.messages.create({
    data: {
      forum_id: forumId,
      user_id: userId,
      content,
      parent_message_id: parentMessageId,
    },
  });
};

/**
 * Obtain root message in a forum without responses
 */
export const getRootMessagesByForum = async (forumId: number) => {
  return await prisma.messages.findMany({
    where: {
      forum_id: forumId,
      parent_message_id: null,
      active: true,
    },
    include: {
      user: {
        select: { user_id: true, name: true, username: true },
      },
      messages: true, // includes responses
    },
    orderBy: { publication_timestamp: 'desc' },
  });
};

export const getRepliesByMessage = async (messageId: number) => {
  return await prisma.messages.findMany({
    where: {
      parent_message_id: messageId,
      active: true,
    },
    include: {
      user: {
        select: { user_id: true, name: true, username: true },
      },
    },
    orderBy: { publication_timestamp: 'asc' },
  });
};