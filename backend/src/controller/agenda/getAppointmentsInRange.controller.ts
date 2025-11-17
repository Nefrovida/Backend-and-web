import {Request, Response} from "express";
import { getAppointmentsInRange } from "../../service/agenda.service"; 
import { AppointmentRecord } from "src/types/appointment.types";

async function getAppointmentsInRangeC(req: Request, res: Response) {
    try {
        const appointments: AppointmentRecord[] = await getAppointmentsInRange(req, res);
        res.status(200).json(appointments);
    } catch (error) {
        console.error("Error fetching appointments in range:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
export default getAppointmentsInRangeC;