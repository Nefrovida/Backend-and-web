import { Request, Response } from "express";
import { prisma } from "../../util/prisma";
import { Type, Status } from "@prisma/client";

// const prisma = new PrismaClient();

async function createAppointment(req: Request, res: Response) {
    try {
        const { user_id, appointment_id, date_hour } = req.body;

        if (!user_id || !appointment_id || !date_hour) {
            return res.status(400).json({
                error: "Missing user_id, appointment_id or date_hour",
            });
        }

        const patient = await prisma.patients.findFirst({
            where: { user_id },
        });

        if (!patient) {
            return res.status(404).json({
                error: "No patient was found for this user",
            });
        }
        const parsedDate = new Date(date_hour);

        if (isNaN(parsedDate.getTime())) {
            return res.status(400).json({
                error: "Invalid date format",
                received: date_hour
            });
        }

        const newAppointment = await prisma.patient_appointment.create({
            data: {
                patient_id: patient.patient_id,
                appointment_id,
                date_hour: parsedDate,
                duration: 30,
                link: null,
                place: null,
                appointment_status: Status.REQUESTED,
                appointment_type: Type.PRESENCIAL,
            },
        });

        res.status(201).json({
            success: true,
            appointment: newAppointment,
        });
    } catch (error) {
        console.error("Error creating appointment:", error);
        res.status(500).json({ error: "Failed to create appointment" });
    }
}

export default createAppointment;
