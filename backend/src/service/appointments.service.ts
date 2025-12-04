import * as appointmentsModel from "../model/appointments.model";
import { notes } from "@prisma/client";
import { NotFoundError } from "../util/errors.util";
import { prisma } from "../util/prisma";
import { Request, Response } from "express";

// const prisma = new PrismaClient();

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
 * @param userId createAppointment
 * @returns List appointment
 */
export const getAllAppointmentsByUserId = async (
  req: Request,
  res: Response,
  userId: string
) => {
  return await appointmentsModel.getAppointmentByUserId(req, res, userId);
};

/**
 *
 * @param validateData data of appointment
 */
export const createAppointment = async (validatedData: any) => {
  return await appointmentsModel.createAppointment(validatedData);
};

/**
 * @param appointmentId ID of the appointment to update
 * @param updateData Data to update the appointment with
 */

export const updateAppointment = async (appointmentId: number, updateData: any) => {
  return await appointmentsModel.updateAppointment(appointmentId, updateData);
};

/**
 * @param appointmentId ID of the appointment to delete
 */
export const deleteAppointment = async (appointmentId: number) => {
  return await appointmentsModel.deleteAppointment(appointmentId);
};

/**
 *
 * @param validateData data of appointment
 */
export const getAppointmentByData = async (validatedData: any) => {
  return await appointmentsModel.getAppointmentByData(validatedData);
};

export const getAppointmentByName = async (appointmentName: string) => {
  return await appointmentsModel.getAppointmentByName(appointmentName);
};

export const getAppointmentByPatient = async (id: string) => {
  const now = new Date()
  const data = await appointmentsModel.getAppointmentByPatient(now, id);

  const parsedData = []

  for (const ap of data) {
    parsedData.push({
      appointmentName: ap.appointment.name.trim(),
      dateHour: ap.date_hour,
      notes: ap.notes.map((n: notes) => ({
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
