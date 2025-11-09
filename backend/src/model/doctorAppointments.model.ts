import { request } from "http";
import { PrismaClient } from "../../prisma/database/prisma";

const prisma = new PrismaClient();

export default class DoctorAppointments {
  static async getDoctorAppointments(userId: string) {
    return await prisma.patient_appointment.findMany({
      where: {
        appointment: {
          doctor: {
            user_id: userId
          }
        }
      },
      include: {
        appointment: {
          include: {
            doctor: {
              include: {
                user: true
              }
            }
          }
        },
        patient: {
          include: {
            user: true
          }
        }
      },
      orderBy: {
        date_hour: 'asc'
      }
    });
  }
}