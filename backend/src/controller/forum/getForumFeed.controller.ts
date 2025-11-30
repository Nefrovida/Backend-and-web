
import Forum from "#/src/model/forum.model";
import { Request, Response } from "express";
import { Message, ParsedMessage } from "#/src/types/forum.types";
import { getFeedSchema } from "#/src/validators/forums/getFeed.validator";

async function getForumFeed(req: Request, res: Response) {
  try {
    const userId = req.user!.userId;

    const parsed = getFeedSchema.safeParse(req.query);
    if (!parsed.success)
      return res.status(400).json({
        errors: parsed.error.flatten(),
      });

    const { page: pageNumber, forumId } = parsed.data;

    const messages = (
      await Forum.getForumFeed(pageNumber, userId, forumId)
    ).map(parseMessages);

    console.log(messages);

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
      name: m.forum.name,
    },
  };
}

export default getForumFeed;
