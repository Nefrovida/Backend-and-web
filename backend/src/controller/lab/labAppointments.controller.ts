// backend/src/controller/lab/labAppointments.controller.ts
import { type Request, type Response } from "express";
import Laboratory from "../../model/lab.model";

export async function getLabAppointments(req: Request, res: Response) {
  try {
    const page = Number(req.query.page ?? 0);
    const pageSize = Number(req.query.pageSize ?? 10);

    const data = await Laboratory.getLabAppointmentsForUpload(page, pageSize);
    res.status(200).json(data);
  } catch (error: any) {
    console.error("Error getting lab appointments: ", error);
    res.status(500).json({ success: false, message: "Error getting lab appointments" });
  }
}

/**
 * Por ahora, presign devuelve una URL dummy.
 * Más adelante se puede integrar S3/MinIO sin cambiar la firma.
 */
export async function requestPresign(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const { mime, size } = req.body ?? {};

    console.log("Presign for lab appointment", { id, mime, size });

    const safeName = `${id}-${Date.now()}.pdf`;
    const url = `http://localhost:3001/uploads/${safeName}`;

    res.status(200).json({ url });
  } catch (error: any) {
    console.error("Error requesting presign URL: ", error);
    res.status(500).json({ success: false, message: "Error requesting presign URL" });
  }
}

export async function confirmUpload(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const { uri } = req.body ?? {};

    if (!uri) {
      return res.status(400).json({ success: false, message: "uri is required" });
    }

    await Laboratory.confirmLabAppointmentResult(id, uri);

    res.status(200).json({ success: true, message: "Result uploaded successfully" });
  } catch (error: any) {
    console.error("Error confirming upload: ", error);
    res.status(500).json({ success: false, message: "Error confirming upload" });
  }
}