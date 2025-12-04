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
          "Revisa que no falta en enviar el user_id, analysis_id o analysis_date",
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

    const parsedDate = new Date(analysis_date);

    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        error: "Formato de fecha invalido",
        received: analysis_date,
      });
    }

    const newAnalysis = await prisma.patient_analysis.create({
      data: {
        patient_id: patient.patient_id,
        analysis_id,
        analysis_date: parsedDate,
        results_date: null,
        place: "Laboratorio Central",
        duration: 30,
        analysis_status: Status.REQUESTED,
        laboratorist_id: null,
      },
    });

    res.status(201).json({
      success: true,
      analysis: newAnalysis,
    });
  } catch (error) {
    console.error("Error al crear la cita de analisis UnU", error);
    res.status(500).json({ error: "Error al crear la cita de analisis" });
  }
}
