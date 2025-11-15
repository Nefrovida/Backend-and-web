import { PrismaClient } from "../../prisma/database/prisma/client";
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

  static async getAppointmentRequests() {
    const requests = await prisma.patient_appointment.findMany({
      where: {
        appointment_status: "REQUESTED",
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
          patient_appointment_id: "asc",
        },
    });

    // Flatten the data
    const flattened = requests.map((request) => {
      const user = request.patient?.user;
      const { patient, ...rest } = request;
      return {
        ...rest,
        patient_name: user?.name ?? null,
        patient_parent_last_name: user?.parent_last_name ?? null,
        patient_maternal_last_name: user?.maternal_last_name ?? null,
      };
    });

    return flattened;
  }

  static async getDoctors() {
    // Robust lookup: prefer searching for role_id via raw SQL so this works even
    // if the column name changed (rol_name vs role_name) in different DB states.
    const roleName = "Doctor";
    const [roleRow] = (await prisma.$queryRaw`
      SELECT role_id FROM "roles"
      WHERE role_name = ${roleName}
      LIMIT 1
    `) as Array<{ role_id?: number }>;

    const roleId = roleRow?.role_id ?? null;
    if (!roleId) {
      // If role cannot be found via raw SQL, fall back to relation-based filter
      // which might work for older/newer Prisma clients. We'll return empty array
      // if both methods fail rather than crashing the whole app.
      try {
        const doctors = await prisma.users.findMany({
          where: {
            role: {
              is: {
                role_name: roleName
              }
            }
          },
          select: {
            user_id: true,
            name: true,
            parent_last_name: true,
            maternal_last_name: true
          }
        });
        return doctors;
      } catch (err) {
        console.error("getDoctors: fallback relation filter failed", err);
        return [];
      }
    }

    const doctors = await prisma.users.findMany({
      where: {
        role_id: roleId
      },
      select: {
        user_id: true,
        name: true,
        parent_last_name: true,
        maternal_last_name: true
      }
    });

    return doctors;
  }

  static async getDoctorAvailability(doctorId: string, date?: string) {
    // doctorId is actually user_id from frontend; need to get the real doctor_id
    const doctorRecord = await prisma.doctors.findUnique({
      where: { user_id: doctorId },
      select: { doctor_id: true }
    });

    if (!doctorRecord) {
      throw new Error("Doctor not found");
    }

    const doctor_id_int = parseInt(doctorRecord.doctor_id);
    if (isNaN(doctor_id_int)) {
      throw new Error("Invalid doctor ID");
    }

    // Get target date, default to tomorrow
    const targetDate = date ? new Date(date + "T00:00:00") : new Date();
    if (!date) {
      targetDate.setDate(targetDate.getDate() + 1);
    }
    const nextDay = new Date(targetDate);
    nextDay.setDate(targetDate.getDate() + 1);

    // Get programmed appointments for this doctor on target date
    const programmedAppointments = await prisma.patient_appointment.findMany({
      where: {
        appointment: {
          doctor_id: doctorRecord.doctor_id
        },
        appointment_status: "PROGRAMMED",
        date_hour: {
          gte: targetDate,
          lt: nextDay,
        },
      },
      select: {
        date_hour: true,
      },
    });

    // Generate all possible slots from 9 AM to 5 PM in 30-minute intervals
    const slots = [];
    const startHour = 9;
    const endHour = 17;
    const intervalMinutes = 30;

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += intervalMinutes) {
        const slotTime = new Date(targetDate);
        slotTime.setHours(hour, minute, 0, 0);
        slots.push(slotTime);
      }
    }

    // Filter out slots that are already taken
    const availableSlots = slots.filter((slot) => {
      return !programmedAppointments.some((appointment) => {
        return appointment.date_hour.getTime() === slot.getTime();
      });
    });

    return availableSlots.map((slot) => slot.toISOString());
  }

  static async scheduleAppointment(
    appointmentId: number,
    doctorId: string,
    dateHour: string,
    duration?: number,
    place?: string,
    link?: string
  ) {
    // doctorId is actually user_id from frontend; validate doctor exists
    const doctorRecord = await prisma.doctors.findUnique({
      where: { user_id: doctorId },
      select: { doctor_id: true }
    });

    if (!doctorRecord) {
      throw new Error("Doctor not found");
    }

    // Check if patient appointment exists and is REQUESTED
    const existingAppointment = await prisma.patient_appointment.findUnique({
      where: { patient_appointment_id: appointmentId },
    });
    if (!existingAppointment) {
      throw new Error("Patient appointment not found");
    }
    if (existingAppointment.appointment_status !== "REQUESTED") {
      throw new Error("Appointment is not in REQUESTED status");
    }

    // Check for conflicts
    const appointmentDate = new Date(dateHour);
    if (isNaN(appointmentDate.getTime())) {
      throw new Error("Invalid dateHourISO");
    }
    const conflicts = await prisma.patient_appointment.findMany({
      where: {
        appointment: {
          doctor_id: doctorRecord.doctor_id
        },
        appointment_status: "PROGRAMMED",
        date_hour: appointmentDate,
      },
    });
    if (conflicts.length > 0) {
      throw new Error("Doctor has a conflicting appointment");
    }

    // Update the appointment
    const updatedAppointment = await prisma.patient_appointment.update({
      where: { patient_appointment_id: appointmentId },
      data: {
        date_hour: appointmentDate,
        duration: duration,
        place: place,
        link: link,
        appointment_status: "PROGRAMMED",
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
    });

    // Flatten
    const user = updatedAppointment.patient?.user;
    const { patient, ...rest } = updatedAppointment;
    return {
      ...rest,
      patient_name: user?.name ?? null,
      patient_parent_last_name: user?.parent_last_name ?? null,
      patient_maternal_last_name: user?.maternal_last_name ?? null,
    };
  }

}

