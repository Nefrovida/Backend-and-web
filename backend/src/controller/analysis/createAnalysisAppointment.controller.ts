// backend/src/controller/analysis/createAnalysisAppointment.controller.ts
import { Request, Response } from "express";
import { prisma } from "#/src/util/prisma";
import { Status } from "@prisma/client";

export default async function createAnalysisAppointment(
    req: Request,
    res: Response
) {
    try {
        const { user_id, analysis_id, analysis_date } = req.body;

        if (!user_id || !analysis_id || !analysis_date) {
            return res.status(400).json({
                error:
                    "Revisa que no falte enviar el user_id, analysis_id o analysis_date",
            });
        }

        const patient = await prisma.patients.findFirst({
            where: { user_id },
        });

        if (!patient) {
            return res.status(404).json({
                error: "No se encontró ningún paciente con ese usuario",
            });
        }

        const appointmentDate = new Date(analysis_date);

        if (isNaN(appointmentDate.getTime())) {
            return res.status(400).json({
                error: "Formato de fecha inválido",
                received: analysis_date,
            });
        }

        const now = new Date();
        if (appointmentDate <= now) {
            return res.status(400).json({
                success: false,
                error: "No puedes agendar análisis en el pasado",
            });
        }

        // 1) Avoid same PATIENT reserving the SAME ANALYSIS TIME SLOT
        const duplicatedForPatient = await prisma.patient_analysis.findFirst({
            where: {
                patient_id: patient.patient_id,
                analysis_date: appointmentDate,
                analysis_status: {
                    not: Status.CANCELED,
                },
            },
        });

        if (duplicatedForPatient) {
            return res.status(409).json({
                success: false,
                error:
                    "Ya tienes un análisis reservado en ese horario. Elige otro horario, por favor.",
            });
        }

        // 2) Avoid same ANALYSIS TYPE using the same slot
        const duplicatedForSlot = await prisma.patient_analysis.findFirst({
            where: {
                analysis_id,
                analysis_date: appointmentDate,
                analysis_status: {
                    not: Status.CANCELED,
                },
            },
        });

        if (duplicatedForSlot) {
            return res.status(409).json({
                success: false,
                error: "Ese horario ya está ocupado para este análisis en laboratorio.",
            });
        }

        const newAnalysis = await prisma.patient_analysis.create({
            data: {
                patient_id: patient.patient_id,
                analysis_id,
                analysis_date: appointmentDate,
                results_date: null,
                place: "Laboratorio Central",
                duration: 30,
                analysis_status: Status.REQUESTED,
                laboratorist_id: null,
            },
        });

        return res.status(201).json({
            success: true,
            analysis: newAnalysis,
        });
    } catch (error) {
        console.error("Error al crear la cita de análisis", error);
        return res
            .status(500)
            .json({ error: "Error al crear la cita de análisis" });
    }
}