import { likes } from "./../../../prisma/database/prisma/client";
import Forum from "#/src/model/forum.model";
import { Request, Response } from "express";
import { Message, ParsedMessage } from "#/src/types/forum.types";

async function getForumFeed(req: Request, res: Response) {
  try {
    const userId = req.user!.userId;

    const { page } = req.query;

    const messages = (await Forum.getForumFeed(Number(page), userId)).map(
      parseMessages
    );

    res.status(200).json(messages);
  } catch (e) {
    res
      .status(500)
      .json({ message: "Error: Server error, could not load forum feed." });
  }
}

function parseMessages(m: Message): ParsedMessage {
  return {
    messageId: m.message_id,
    content: m.content,
    likes: m._count.likes,
    replies: m._count.messages,
    forums: {
      forumId: m.forum.forum_id,
      name: m.forum.name.split(" -")[0],
    },
  };
}

export default getForumFeed;
