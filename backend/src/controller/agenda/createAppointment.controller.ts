import { Request, Response } from "express";
import { prisma } from "../../util/prisma";
import { Type, Status } from "@prisma/client";

async function createAppointment(req: Request, res: Response) {
    try {
        const { user_id, appointment_id, date_hour } = req.body;

        if (!user_id || !appointment_id || !date_hour) {
            return res.status(400).json({
                error: "Revisa que no falta en enviar el user_id, appointment_id o date_hour",
            });
        }

        const patient = await prisma.patients.findFirst({
            where: { user_id },
        });

        if (!patient) {
            return res.status(404).json({
                error: "No se encontro ningun paciente con ese usuario :p",
            });
        }

        // Parse date with the same logic as createAnalysisAppointment
        let appointmentDate: Date;
    
        if (date_hour.includes('T')) {
            // Parse as "YYYY-MM-DDTHH:mm:ss" format
            const [datePart, timePart] = date_hour.split('T');
            const [year, month, day] = datePart.split('-').map(Number);
            const [hours, minutes, seconds = 0] = timePart.replace('Z', '').split(':').map(Number);
            
            // Create date using local timezone (backend will subtract 6 hours)
            appointmentDate = new Date(year, month - 1, day, hours - 6, minutes, seconds);
        } else {
            // Fallback to direct parsing
            appointmentDate = new Date(date_hour);
        }
        
        const now = new Date();
        if (appointmentDate <= now) {
            res.status(400).json({ success: false });
            return;
        }

        if (isNaN(appointmentDate.getTime())) {
            return res.status(400).json({
                error: "Formato de fecha invalido",
                received: date_hour
            });
        }

        const newAppointment = await prisma.patient_appointment.create({
            data: {
                patient_id: patient.patient_id,
                appointment_id,
                date_hour: appointmentDate,
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
        console.error("Error al crear la cita UnU", error);
        res.status(500).json({ error: "Error al crear la cita" });
    }
}

export default createAppointment;