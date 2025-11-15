import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default class Agenda {
  constructor() {}

  static async getAppointmentsPerDay(targetDate: string) {
    const [year, month, day] = targetDate.split("-").map(Number);
    // Convert to Mexico time
    const start = new Date(year, month - 1, day, 0, 0, 0);
    const end = new Date(year, month - 1, day + 1, 0, 0, 0);

    const appointments = await prisma.patient_appointment.findMany({
      where: {
        date_hour: {
          gte: start,
          lt: end,
        },
      },
      include: {
        patient: {
          include: {
            user: {
              select: {
                name: true,
                parent_last_name: true,
                maternal_last_name: true,
              },
            },
          },
        },
      },
      orderBy: {
        date_hour: "asc",
      },
    });

    // Desanidar joins
    const flattened = appointments.map((a) => {
      const user = a.patient?.user;

      const { patient, ...rest } = a;

      return {
        ...rest,
        patient_name: user?.name ?? null,
        patient_parent_last_name: user?.parent_last_name ?? null,
        patient_maternal_last_name: user?.maternal_last_name ?? null,
      };
    });

    return flattened;
  }

    static async cancelAppointment(id: number) {
      const appointmentId = id;
      await prisma.patient_appointment.update({
      where: { appointment_id: id },
      data: { appointment_status: "CANCELED" },
});

    }

}

