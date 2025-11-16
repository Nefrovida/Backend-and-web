import { Request, Response } from "express";
import Forum from "src/model/forum.model";

async function postNewMessage(req: Request, res: Response) {
  try {
    const { forumId } = req.params;
    const userId = req.user?.userId;
    const content: string | null = req.body.message ?? null;

    if (!content) {
      res.status(401).json({ message: "Mensaje vació" });
      return;
    }

    if (!userId) {
      res.status(403).json({ message: "Usuario no inició sesión" });
      return;
    }

    const response = await Forum.postNewMessage(
      userId,
      Number(forumId),
      content
    );
    res.status(200).json({ message: "Exitoso" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error imprevisto" });
    return;
  }
}

export default postNewMessage;
