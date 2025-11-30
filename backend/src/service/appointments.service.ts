import * as appointmentsModel from "../model/appointments.model";
import { NotFoundError } from "../util/errors.util";
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

/**
 * Get all appointments for a doctor
 */
export const getDoctorAppointments = async (userId: string) => {
  const doctors = await prisma.$queryRaw<Array<{ doctor_id: string }>>`
    SELECT doctor_id FROM doctors WHERE user_id = ${userId}::uuid
  `;

  if (!doctors || doctors.length === 0) {
    throw new NotFoundError("Doctor not found for this user");
  }

  const doctorId = doctors[0].doctor_id;

  const appointments = await appointmentsModel.getDoctorAppointments(doctorId);

  return appointments;
};

export const getAllAppointments = async () => {
  const appointments = await appointmentsModel.getAllAppointments();
  return appointments;
};
/**
 *
 * @param userId
 * @returns List appointment
 */
export const getAllAppointmentsByUserId = async (
  req: Request,
  res: Response,
  userId: string
) => {
  return await appointmentsModel.getAppointmentByUserId(req, res, userId);
};

export const getAppointmentByName = async (appointmentName: string) => {
  return await appointmentsModel.getAppointmentByName(appointmentName);
};

export const getAppointmentByPatient = async(id: string) => {
  const now = new Date()
  const data = await appointmentsModel.getAppointmentByPatient(now, id);

  const parsedData = []

  for (const ap of data) {
    parsedData.push({
      appointmentName: ap.appointment.name.trim(),
      dateHour: ap.date_hour,
      notes: ap.notes.map(n => ({
        content: n.content,
        generalNotes: n.general_notes,
        ailments: n.ailments,
        prescription: n.prescription,
        visibility: n.visibility
      }))
    });
  }

  return parsedData



};
