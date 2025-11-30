import { PrismaClient } from "@prisma/client";
import {Request, Response} from 'express';
import { ZodError } from 'zod';

const prisma = new PrismaClient();

/**
 * Get all appointments for a specific doctor
 * @param doctorId - The ID of the doctor whose appointments to retrieve
 * @returns Array of appointments with patient and appointment details
 */
export const getDoctorAppointments = async (doctorId: string) => {

  const appointments = await prisma.patient_appointment.findMany({
    where: {
      appointment: {
        doctor_id: doctorId,
      },
    },
    include: {
      appointment: {
        select: {
          appointment_id: true,
          name: true,
          general_cost: true,
          community_cost: true,
          image_url: true,
        },
      },
      patient: {
        include: {
          user: {
            select: {
              user_id: true,
              name: true,
              parent_last_name: true,
              maternal_last_name: true,
              phone_number: true,
              birthday: true,
              gender: true,
            },
          },
        },
      },
    },
    orderBy: {
      date_hour: 'desc',
    },
  });

  // Flatten the nested structure for easier consumption
  const formattedAppointments = appointments.map((appt) => {
    const user = appt.patient?.user;
    const { patient, appointment, ...appointmentData } = appt;

    return {
      ...appointmentData,
      appointment_name: appointment.name,
      appointment_general_cost: appointment.general_cost,
      appointment_community_cost: appointment.community_cost,
      appointment_image_url: appointment.image_url,
      patient_id: patient.patient_id,
      patient_name: user?.name ?? null,
      patient_parent_last_name: user?.parent_last_name ?? null,
      patient_maternal_last_name: user?.maternal_last_name ?? null,
      patient_phone: user?.phone_number ?? null,
      patient_birthday: user?.birthday ?? null,
      patient_gender: user?.gender ?? null,
    };
  });

  return formattedAppointments;
};

  export const getAllAppointments = async () => {
    const appointments = await prisma.appointments.findMany({
      select: {
      appointment_id: true,
      doctor_id: true,
      name: true,
      general_cost: true,
      community_cost: true,
      image_url: true,
    },
      where: {
        active: true,
      },
    });
    return appointments;
  };


  export const createAppointment = async ( validatedData: any) => {
    try {
      const newAppointment = await prisma.appointments.create({
        data: validatedData,
      });
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        throw new Error(`Validation error: ${error.errors.map(e => e.message).join(', ')}`);
      }
      throw error;
    }
  };

  export const getAppointmentByData = async (validatedData: any) => {
    return await prisma.appointments.findFirst({
      where: {
        name: validatedData.name,
        doctor_id: validatedData.doctor_id
      },
    });
  };

  export const getAppointmentByUserId = async (req: Request, res: Response, UserId: string) =>{
    const patientId  = await prisma.patients.findFirst({
        where: {
            user_id: UserId
        },
    });

    if (!patientId) {
        return res.status(404).json({ error: 'Patient not found' });
    }
      const appointments = await prisma.patient_appointment.findMany({
          where: { patient_id: patientId.patient_id},
          include: {
            appointment: {
              select: {
                name: true,
            }
          }
        }
      });

      const analysis = await prisma.patient_analysis.findMany({
          where: { patient_id: patientId.patient_id },
          include: {
            analysis: {
              select: {
                name: true,
              }
            }
          }
      });

      return { appointments, analysis };
}

export const getAppointmentByName = async (appointmentName: string) => {
  try {
    const appointment = await prisma.appointments.findFirst({
      where: { name: appointmentName },
    });
    if (!appointment) {
      throw new Error("Appointment not found");
    }
    return appointment;
  } catch (error) {
    console.error('Error fetching appointment by name:', error);
    throw new Error('Failed to fetch appointment by name');
  }
}
