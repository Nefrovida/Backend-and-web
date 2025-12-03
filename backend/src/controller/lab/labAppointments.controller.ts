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
    const url = `http://localhost:3001/uploads/${safeName}`;

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

    // Validate that the URI points to our uploads server and has the expected format
    const uploadsBase = "http://localhost:3001/uploads/";
    if (!uri.startsWith(uploadsBase)) {
      return res.status(400).json({
        success: false,
        message: "La URL de resultados no es válida.",
      });
    }

    const fileName = uri.substring(uploadsBase.length); // ex: "5-1234567890.pdf"
    const fileNameRegex = /^[0-9]+-[0-9]+\.pdf$/;

    if (!fileNameRegex.test(fileName)) {
      return res.status(400).json({
        success: false,
        message: "La URL de resultados no tiene un formato permitido.",
      });
    }

    await Laboratory.confirmLabAppointmentResult(id, uri);

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
