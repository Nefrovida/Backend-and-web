// backend/src/model/agenda.model.ts
import { prisma } from "../util/prisma";

export default class Agenda {
  constructor() { }

  // Daily secretary appointments (includes patient name)
  static async getAppointmentsPerDaySec(targetDate: string) {
    const [year, month, day] = targetDate.split("-").map(Number);

    // MX local time
    const start = new Date(year, month - 1, day, 0, 0, 0);
    const end = new Date(year, month - 1, day + 1, 0, 0, 0);

    const appointments = await prisma.patient_appointment.findMany({
      where: {
        date_hour: {
          gte: start,
          lt: end,
        },
        appointment_status: {
          not: "CANCELED",
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

    // Unnest joins
    const flattened = appointments.map((a) => {
      const user = a.patient?.user;
      const { patient, ...rest } = a;

      const fullName = [
        user?.name,
        user?.parent_last_name,
        user?.maternal_last_name,
      ]
        .filter(Boolean)
        .join(" ");

      return {
        ...rest,
        name: fullName || null,
      };
    });

    return flattened;
  }

  // Daily doctor appointments (includes doctor name)
  static async getAppointmentsPerDay(targetDate: string) {
    const [year, month, day] = targetDate.split("-").map(Number);

    const start = new Date(year, month - 1, day, 0, 0, 0);
    const end = new Date(year, month - 1, day + 1, 0, 0, 0);

    const appointments = await prisma.patient_appointment.findMany({
      where: {
        date_hour: {
          gte: start,
          lt: end,
        },
        appointment_status: {
          not: "CANCELED",
        },
      },
      select: {
        patient_appointment_id: true,
        patient_id: true,
        date_hour: true,
        duration: true,
        link: true,
        place: true,
        appointment_type: true,
        appointment_status: true,
        appointment: {
          select: {
            appointment_id: true,
            doctor: {
              select: {
                doctor_id: true,
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
        },
      },
    });

    // Unnest
    const flattened = appointments.map((a) => {
      const doctorUser = a.appointment?.doctor?.user;
      const { appointment, ...rest } = a;

      const fullName = [
        doctorUser?.name,
        doctorUser?.parent_last_name,
        doctorUser?.maternal_last_name,
      ]
        .filter(Boolean)
        .join(" ");

      return {
        ...rest,
        appointment_id: appointment?.appointment_id ?? null,
        name: fullName || null,
      };
    });

    return flattened;
  }

  static async cancelAppointment(id: number) {
    await prisma.patient_appointment.update({
      where: { patient_appointment_id: id },
      data: { appointment_status: "CANCELED" },
    });
  }

  static async getAppointmentById(id: number) {
    const appointment = await prisma.patient_appointment.findUnique({
      where: {
        patient_appointment_id: Number(id),
      },
      select: {
        patient_appointment_id: true,
        patient_id: true,
        date_hour: true,
        duration: true,
        link: true,
        place: true,
        appointment_type: true,
        appointment_status: true,
        appointment: {
          select: {
            appointment_id: true,
            doctor: {
              select: {
                doctor_id: true,
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
        },
      },
    });

    if (!appointment) return null;

    // Unnest
    const { appointment: nestedAppointment, ...rest } = appointment;
    const nestedUser = nestedAppointment?.doctor?.user;

    const fullName = [
      nestedUser?.name,
      nestedUser?.parent_last_name,
      nestedUser?.maternal_last_name,
    ]
      .filter(Boolean)
      .join(" ");

    return {
      ...rest,
      appointment_id: nestedAppointment?.appointment_id ?? null,
      name: fullName || null,
    };
  }
}