import { likeMessageModel } from "#/src/model/forums/likeMessage.model";
import { Request, Response } from "express";

export async function likeMessage(req: Request, res: Response) {
  try {
    const userId = req.user!.userId;

    const { messageId } = req.params;

    const selectedMessageId = Number(messageId);

    if (isNaN(selectedMessageId))
      return res.status(400).json({ message: "MessageId is not valid" });

    const result = await likeMessageModel(selectedMessageId, userId);

    return res.status(200).json({ message: "Success" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: e });
  }
}
