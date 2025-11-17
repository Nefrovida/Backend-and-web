import * as appointmentsModel from '../model/appointments.model';
import { NotFoundError } from '../util/errors.util';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Get all appointments for a doctor
 */
export const getDoctorAppointments = async (userId: string) => {

  const doctors = await prisma.$queryRaw<Array<{ doctor_id: string }>>`
    SELECT doctor_id FROM doctors WHERE user_id = ${userId}::uuid
  `;

  if (!doctors || doctors.length === 0) {
    throw new NotFoundError('Doctor not found for this user');
  }

  const doctorId = doctors[0].doctor_id;

  const appointments = await appointmentsModel.getDoctorAppointments(doctorId);

  return appointments;
};

/**
 * 
 * @param userId 
 * @returns List appointment
 */
export const getAllAppointmentsByUserId = async (userId: string) => {
  return await appointmentsModel.getAppointmentByUserId(userId);
};
