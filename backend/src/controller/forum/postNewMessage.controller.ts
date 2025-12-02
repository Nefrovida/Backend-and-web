import { Request, Response } from "express";
import Forum from "src/model/forum.model";
import sanitizeHtml from "sanitize-html";


function sanitizeMessage(raw: string) {
    if (!raw) return "";

    return sanitizeHtml(raw, {
        allowedTags: [],         
        allowedAttributes: {},   
        disallowedTagsMode: "discard"
    }).trim();
}

async function postNewMessage(req: Request, res: Response) {
  try {
    const { forumId } = req.params;
    const userId = req.user?.userId;
    const content: string | null = req.body.message ?? null;

    if (!content) {
      res.status(401).json({ message: "Mensaje vacio" });
      return;
    }

    if (!userId) {
      res.status(403).json({ message: "Usuario no inició sesión" });
      return;
    }

    const contentClean = sanitizeMessage(content);

    if (!contentClean) {
      return res.status(400).json({
        error: "Mensaje inválido"
      });
    }

    const response = await Forum.postNewMessage(
      userId,
      Number(forumId),
      contentClean
    );
    res.status(200).json({ message: "Exitoso" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error imprevisto" });
    return;
  }
}

export default postNewMessage;
