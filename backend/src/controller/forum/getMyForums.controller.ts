import { Request, Response } from "express";
import { getAll } from "../forums.controller";
import Forum from "src/model/forum.model";

// Get public and joined forums: max 10
async function getMyForums(req: Request, res: Response) {
  try {
    const userId = req.user!.userId;

    const forums = await Forum.getMyForums(userId);

    res.status(200).json(forums);
  } catch (e) {
    console.error("Error: ", e);
    res.status(500).json({ message: "Error: " + e });
  }
}

export default getMyForums;
