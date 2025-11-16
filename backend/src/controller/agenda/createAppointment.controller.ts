import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

        const newAppointment = await prisma.patient_appointment.create({
            data: {
                patient_id: patient.patient_id,
                appointment_id,
                date_hour: new Date(date_hour),
                duration: 30,
                link: null,
                place: null,
                appointment_status: "REQUESTED",
                appointment_type: "PRESENCIAL",
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
