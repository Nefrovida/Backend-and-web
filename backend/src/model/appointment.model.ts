import { prisma } from '../util/prisma';

export default class AppointmentModel {
  
  /**
   * Obtener todas las citas
   */
  static async getAllAppointments() {
    const appointments = await prisma.patient_appointment.findMany({
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
        appointment: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        date_hour: 'asc',
      },
    });

    return this.flattenAppointments(appointments);
  }

  /**
   * Obtener citas de un día específico
   */
  static async getAppointmentsByDay(targetDate: string) {
    const [year, month, day] = targetDate.split('-').map(Number);
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
        date_hour: 'asc',
      },
    });

    return this.flattenAppointments(appointments);
  }

  /**
   * Obtener cita por ID
   */
  static async getAppointmentById(id: number) {
    const appointment = await prisma.patient_appointment.findUnique({
      where: {  patient_appointment_id: id  },
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

    if (!appointment) return null;

    const [flattened] = this.flattenAppointments([appointment]);
    return flattened;
  }

  /**
   * Verificar disponibilidad de horario
   */
  static async isTimeSlotAvailable(date_hour: Date): Promise<boolean> {
    const existing = await prisma.patient_appointment.findFirst({
      where: {
        date_hour,
        appointment_status: {
          not: 'CANCELED',
        },
      },
    });


    return !existing;
  }

  /**
   * Reagendar una cita (actualizar fecha y motivo)
   */
 static async rescheduleAppointment(
  id: number,
  date_hour: Date,
  reason: string
  ) {
  const updated = await prisma.patient_appointment.update({
    where: { patient_appointment_id: id },
    data: {
      date_hour, 
      appointment_status: 'PROGRAMMED',
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
      appointment: {
        select: {
          name: true, 
        },
      },
    },
  });

  const [flattened] = this.flattenAppointments([updated]);
  return flattened;
}

  /**
   * Desanidar joins (helper method)
   */
  private static flattenAppointments(appointments: any[]) {
    return appointments.map((a) => {
      const user = a.patient?.user;
      const { patient, ...rest } = a;

      return {
        ...rest,
        id: a.patient_appointment_id,
        patient_name: user?.name ?? null,
        patient_parent_last_name: user?.parent_last_name ?? null,
        patient_maternal_last_name: user?.maternal_last_name ?? null,
        reason: a.appointment?.name ?? 'Sin motivo',
      };
    });
  }
  static async deleteAppointment(appointmentId: number){
    const appoinmentDeleted = await prisma.patient_appointment.update({
      where : {
        patient_appointment_id: appointmentId,
        AND: {
          OR: [{
            appointment_status : "REQUESTED"
          },
          {
            appointment_status : "PROGRAMMED"
          }
        ]
        } 
      },
      data: {
        appointment_status: "CANCELED",
      },
    })
    return;
  }
}