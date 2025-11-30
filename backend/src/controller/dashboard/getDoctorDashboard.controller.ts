import Dashboard from "#/src/model/dashboard.model";
import { DoctorDashboardInfo } from "#/src/types/dashboard/dashboard.types";
import { Request, Response } from "express";

export default async function getDoctorDashboard(req: Request, res: Response) {
  try {
    const userId = req.user!.userId;

    const doctorData: DoctorDashboardInfo = await Dashboard.getDoctorData(
      userId
    );

    return res.status(200).json(doctorData);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
}
