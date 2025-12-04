import { Request, Response } from "express";
import Forum from "src/model/forum.model";
import sanitizeHtml from "sanitize-html";
import { postMessageSchema } from "#/src/validators/forum.validator";
import { ZodError } from "zod";

function sanitizeMessage(raw: string) {
  if (!raw) return "";

  return sanitizeHtml(raw, {
    allowedTags: [],
    allowedAttributes: {},
    disallowedTagsMode: "discard",
  }).trim();
}

async function postNewMessage(req: Request, res: Response) {
  try {
    const { forumId } = req.params;
    const userId = req.user?.userId;
    const validatedData = postMessageSchema.parse(req.body);

    if (!userId) {
      res.status(403).json({ message: "Usuario no inició sesión" });
      return;
    }

    const content = validatedData.content;
    const contentClean = sanitizeMessage(content);

    if (!contentClean) {
      return res.status(400).json({
        error: "Mensaje inválido",
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

    if (e instanceof ZodError) {
      const formatted = e.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));
      res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Error de validación en los datos enviados",
          details: formatted,
        },
      });
      return;
    }

    res.status(500).json({ message: "Error imprevisto" });
    return;
  }
}

export default postNewMessage;
