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
  // Normalize and validate patient_id: the frontend may send a `user_id` instead
  // of the `patients.patient_id`. Try to resolve it to an existing patient.
  try {
    // 1) Check appointment exists
    const appointment = await appointmentsModel.getAppointmentById(appointmentData.appointment_id);
    if (!appointment) {
      throw new NotFoundError(`Appointment with ID ${appointmentData.appointment_id} not found`);
    }

    // 2) Ensure patient_id refers to an existing patients.patient_id; if not,
    //    try to resolve it as a users.user_id -> find the corresponding patient
    let patient = await prisma.patients.findUnique({ where: { patient_id: appointmentData.patient_id } });
    if (!patient) {
      // maybe frontend sent the user_id instead of patient_id
      patient = await prisma.patients.findFirst({ where: { user_id: appointmentData.patient_id } });
      if (patient) {
        appointmentData.patient_id = patient.patient_id; // replace with real patient_id
      }
    }

    if (!patient) {
      throw new NotFoundError(`Patient not found for id provided`);
    }

    // 3) Create patient appointment
    return await appointmentsModel.createPatientAppointment(appointmentData);
  } catch (error: any) {
    // Surface Prisma FK errors as NotFound for clarity, otherwise rethrow
    if (error?.code === 'P2003') {
      throw new NotFoundError('Referenced record not found (patient or appointment)');
    }
    throw error;
  }
};