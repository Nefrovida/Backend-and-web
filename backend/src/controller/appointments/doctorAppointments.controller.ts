import type { Request, Response } from "express";
import DoctorAppointments from "../../model/doctorAppointments.model";

async function getAppointmentsByDoctor(req: Request, res: Response) {
    try {
        const user_id = req.params.user_id;

        const appointments = await DoctorAppointments.getDoctorAppointments(user_id);

        return res.status(200).json({
            success: true,
            data: appointments
        });
    } catch (error) {
        console.error("Error fetching doctor appointments:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching appointments"
        });
    }
}

export default getAppointmentsByDoctor;