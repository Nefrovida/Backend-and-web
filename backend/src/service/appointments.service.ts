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

/**
 * Get appointment by ID to validate it exists
 * @param appointmentId - The ID of the appointment
 * @returns The appointment or throws error if not found
 */
export const validateAppointment = async (appointmentId: number) => {
  const appointment = await appointmentsModel.getAppointmentById(appointmentId);
  if (!appointment) {
    throw new NotFoundError(`Appointment with ID ${appointmentId} not found`);
  }
  return appointment;
};

/**
 * Create a patient appointment (schedule an appointment)
 * @param appointmentData - Data for the patient appointment
 * @returns The created patient appointment
 */
export const schedulePatientAppointment = async (appointmentData: {
  patient_id: string;
  appointment_id: number;
  date_hour: Date;
  duration: number;
  appointment_type: 'PRESENCIAL' | 'VIRTUAL';
  link?: string | null;
  place?: string | null;
  appointment_status: 'REQUESTED' | 'PROGRAMMED' | 'FINISHED' | 'CANCELED' | 'MISSED';
}) => {
  appointmentData.appointment_type = appointmentData.appointment_type.toUpperCase() as 'PRESENCIAL' | 'VIRTUAL';
  return await appointmentsModel.createPatientAppointment(appointmentData);
};