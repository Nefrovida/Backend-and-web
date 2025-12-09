// backend/src/controller/agenda/createAppointment.controller.ts
import { Request, Response } from "express";
import { prisma } from "../../util/prisma";
import { Type, Status } from "@prisma/client";
import { parseClientDateToUTC } from "../../util/date.util";

async function createAppointment(req: Request, res: Response) {
    try {
        const { user_id, appointment_id, date_hour } = req.body;

        if (!user_id || !appointment_id || !date_hour) {
            return res.status(400).json({
                error:
                    "Revisa que no falte enviar el user_id, appointment_id o date_hour",
            });
        }

        const patient = await prisma.patients.findFirst({
            where: { user_id },
        });

        if (!patient) {
            return res.status(404).json({
                error: "No se encontró ningún paciente con ese usuario :p",
            });
        }

        let appointmentDate: Date;
        try {
            appointmentDate = parseClientDateToUTC(date_hour);
        } catch (e) {
            return res.status(400).json({
                error: "Formato de fecha inválido",
                received: date_hour,
            });
        }

        if (isNaN(appointmentDate.getTime())) {
            return res.status(400).json({
                error: "Formato de fecha inválido",
                received: date_hour,
            });
        }

        const now = new Date();
        if (appointmentDate <= now) {
            return res.status(400).json({
                success: false,
                error: "No puedes agendar citas en el pasado",
            });
        }

        // 1) Evitar que el MISMO PACIENTE reserve dos veces el mismo horario
        const duplicatedForPatient = await prisma.patient_appointment.findFirst({
            where: {
                patient_id: patient.patient_id,
                date_hour: appointmentDate,
                appointment_status: {
                    not: Status.CANCELED, // si la cita está cancelada, se podría volver a reservar
                },
            },
        });

        if (duplicatedForPatient) {
            return res.status(409).json({
                success: false,
                error:
                    "Ya tienes una cita reservada en ese horario. Elige otro horario, por favor.",
            });
        }

        // 2) (Opcional) Evitar doble reserva para el MISMO appointment_id en ese horario
        /*
        const duplicatedForSlot = await prisma.patient_appointment.findFirst({
          where: {
            appointment_id,
            date_hour: appointmentDate,
            appointment_status: {
              notIn: [Status.CANCELED, Status.FINISHED],
            },
          },
        });
    
        if (duplicatedForSlot) {
          return res.status(409).json({
            success: false,
            error: "Ese horario ya está ocupado para esta consulta.",
          });
        }
        */

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

        return res.status(201).json({
            success: true,
            appointment: newAppointment,
        });
    } catch (error) {
        console.error("Error al crear la cita UnU", error);
        return res.status(500).json({ error: "Error al crear la cita" });
    }
}

export default createAppointment;