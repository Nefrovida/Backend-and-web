import { Request, Response } from "express";
import { getAll } from "../forums.controller";
import Forum from "src/model/forum.model";

async function getMyForums(req: Request, res: Response) {
  try {
    const userId = req.user!.userId;

    const forums = (await Forum.getMyForums(userId)).map((f) => ({
      forumId: f.forum.forum_id,
      name: f.forum.name,
    }));
    res.status(200).json(forums);
  } catch (e) {}
}

export default getMyForums;
