// backend/src/controller/lab/labAppointments.controller.ts
import { type Request, type Response } from "express";
import Laboratory from "../../model/lab.model";

const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024; // 20 MB

export async function getLabAppointments(req: Request, res: Response) {
  try {
    const page = Number(req.query.page ?? 0);
    const pageSize = Number(req.query.pageSize ?? 10);

    const data = await Laboratory.getLabAppointmentsForUpload(page, pageSize);
    res.status(200).json(data);
  } catch (error: any) {
    console.error("Error getting lab appointments: ", error);
    res
      .status(500)
      .json({ success: false, message: "Error getting lab appointments" });
  }
}

export async function requestPresign(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const { mime, size } = req.body ?? {};

    if (!id || Number.isNaN(id)) {
      return res.status(400).json({
        error: {
          code: "INVALID_ID",
          message: "El identificador de la cita de laboratorio no es válido.",
        },
      });
    }

    if (!mime || typeof mime !== "string" || typeof size !== "number") {
      return res.status(400).json({
        error: {
          code: "INVALID_PAYLOAD",
          message: "Faltan datos del archivo (tipo o tamaño).",
        },
      });
    }

    if (mime !== "application/pdf") {
      return res.status(400).json({
        error: {
          code: "INVALID_MIME",
          message: "Solo se permiten archivos PDF.",
        },
      });
    }

    if (size > MAX_FILE_SIZE_BYTES) {
      return res.status(400).json({
        error: {
          code: "FILE_TOO_LARGE",
          message: "El archivo supera el límite de 20 MB.",
        },
      });
    }

    const safeName = `${id}-${Date.now()}.pdf`;
    const base = process.env.SERVER_ORIGIN || `http://localhost:${process.env.SERVER_PORT ?? 3001}`;
    const url = `${base.replace(/\/$/, '')}/uploads/${safeName}`;

    res.status(200).json({ url });
  } catch (error: any) {
    console.error("Error requesting presign URL: ", error);
    res
      .status(500)
      .json({ success: false, message: "Error requesting presign URL" });
  }
}

export async function confirmUpload(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const { uri } = req.body ?? {};

    if (!id || Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "El identificador de la cita de laboratorio no es válido.",
      });
    }

    if (!uri || typeof uri !== "string" || uri.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "uri is required",
      });
    }

    // Accept absolute or relative upload URIs, and normalize to the filename
    const uploadsBase = (process.env.SERVER_ORIGIN || `http://localhost:${process.env.SERVER_PORT ?? 3001}`).replace(/\/$/, '') + "/uploads/";
    let fileName: string | null = null;

    if (uri.startsWith(uploadsBase)) {
      // Absolute URL (e.g. https://example.com/uploads/5-123.pdf)
      fileName = uri.substring(uploadsBase.length);
    } else if (uri.startsWith("/uploads/")) {
      // Relative path with leading slash
      fileName = uri.substring("/uploads/".length);
    } else if (uri.startsWith("uploads/")) {
      // Relative path without leading slash
      fileName = uri.substring("uploads/".length);
    } else {
      return res.status(400).json({
        success: false,
        message: "La URL de resultados no es válida.",
      });
    }
    const fileNameRegex = /^[0-9]+-[0-9]+\.pdf$/;

    if (!fileName || !fileNameRegex.test(fileName)) {
      return res.status(400).json({
        success: false,
        message: "La URL de resultados no tiene un formato permitido.",
      });
    }

    // Normalize to relative path before storing in DB
    const relativePath = `/uploads/${fileName}`;
    await Laboratory.confirmLabAppointmentResult(id, relativePath);

    res
      .status(200)
      .json({ success: true, message: "Result uploaded successfully" });
  } catch (error: any) {
    console.error("Error confirming upload: ", error);
    res.status(500).json({
      success: false,
      message: error?.message || "Error confirming upload",
    });
  }
}
