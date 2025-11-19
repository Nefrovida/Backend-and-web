import Forum from "#/src/model/forum.model";
import { Request, Response } from "express";

async function getForumFeed(req: Request, res: Response) {
  try {
    const userId = req.user!.userId;

    await Forum.getForumFeed(userId);
  } catch (e) {
    res
      .status(500)
      .json({ message: "Error: Server error, could not load forum feed." });
  }
}

export default getForumFeed;
