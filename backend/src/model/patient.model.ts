import { prisma } from "src/util/prisma";

export default class Patients {
  Patients() {

  }

  static async getAllPatients() {
    return await prisma.patients.findMany({
      select: {
        patient_id: true,
        curp: true,
        user_id: true,
        user: {
          select: {
            name: true,
            parent_last_name: true,
            maternal_last_name: true,
          }
        }
      },
      orderBy: {
        user: {
          name: 'asc'
        }
      }
    });
  }

  static async getMyPatients(doctorId: string) {
    return await prisma.patient_appointment.findMany({
      where: {
        appointment: {
          doctor: {
            user_id: doctorId
          }
        }
      },
      distinct: ["patient_id"],
      select: {
        patient: {
          select: {
            patient_id: true,
            user: {
              select: {
                name: true,
                parent_last_name: true,
                maternal_last_name: true,
              }
            }
          }
        }
      }
    })
  }
}