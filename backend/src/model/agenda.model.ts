import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default class Agenda {
  constructor() {}

static async getAppointmentsPerDaySec(targetDate: string) {
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

    // Desanidar joins
   const flattened = appointments.map((a) => {
  const user = a.patient?.user;
  const { patient, ...rest } = a;

  const fullName = [
    user?.name,
    user?.parent_last_name,
    user?.maternal_last_name
  ].filter(Boolean)
   .join(' '); 

  return {
    ...rest,
    name: fullName || null, 
  };
});


    return flattened;
  }

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

  // Desanidar
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
    const appointmentId = id;
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

  // Desanidar 
  const { appointment: nestedAppointment, ...rest } = appointment;
  const appointment_id = nestedAppointment?.appointment_id;
  const user = nestedAppointment?.doctor?.user;

  const fullName = [
    user?.name,
    user?.parent_last_name,
    user?.maternal_last_name,
  ]
    .filter(Boolean)
    .join(" ");

  return {
    ...rest,
    appointment_id,
    name: fullName || null,
  };
}

  static async getPendingAppointmentRequests() {
    const requests = await prisma.patient_appointment.findMany({
      where: {
        appointment_status: 'REQUESTED',
      },
      include: {
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
        appointment: {
          include: {
            doctor: {
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
        },
      },
      orderBy: {
        date_hour: 'asc',
      },
    });

    return requests.map((req) => ({
      patient_appointment_id: req.patient_appointment_id,
      patient_id: req.patient_id,
      patient_name: `${req.patient.user.name} ${req.patient.user.parent_last_name} ${req.patient.user.maternal_last_name}`,
      patient_phone: req.patient.user.phone_number,
      appointment_name: req.appointment.name,
      appointment_type: req.appointment_type,
      requested_date: req.date_hour,
      duration: req.duration,
      current_doctor: req.appointment.doctor
        ? `${req.appointment.doctor.user.name} ${req.appointment.doctor.user.parent_last_name}`
        : null,
    }));
  }

  static async getDoctors() {
    const doctors = await prisma.doctors.findMany({
      include: {
        user: {
          select: {
            name: true,
            parent_last_name: true,
            maternal_last_name: true,
          },
        },
      },
    });

    return doctors.map((doctor) => ({
      doctor_id: doctor.doctor_id,
      name: `${doctor.user.name} ${doctor.user.parent_last_name} ${doctor.user.maternal_last_name}`,
      specialty: doctor.specialty,
    }));
  }

  static async getDoctorAvailability(doctorId: string, date: string) {
    const targetDate = new Date(date);
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Get all appointments for this doctor on this date
    const bookedAppointments = await prisma.patient_appointment.findMany({
      where: {
        appointment: {
          doctor_id: doctorId,
        },
        date_hour: {
          gte: startOfDay,
          lte: endOfDay,
        },
        appointment_status: {
          in: ['PROGRAMMED', 'FINISHED'],
        },
      },
      select: {
        date_hour: true,
        duration: true,
      },
    });

    // Generate available time slots (e.g., 8 AM to 6 PM, every 30 minutes)
    const availableSlots: string[] = [];
    const workStart = 8; // 8 AM
    const workEnd = 18; // 6 PM

    for (let hour = workStart; hour < workEnd; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const slotTime = new Date(targetDate);
        slotTime.setHours(hour, minute, 0, 0);

        // Check if this slot conflicts with any booked appointment
        const isBooked = bookedAppointments.some((appt) => {
          if (!appt.date_hour) return false;
          const apptStart = new Date(appt.date_hour);
          const apptEnd = new Date(apptStart.getTime() + appt.duration * 60000);
          return slotTime >= apptStart && slotTime < apptEnd;
        });

        if (!isBooked) {
          availableSlots.push(
            `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
          );
        }
      }
    }

    return availableSlots;
  }

  static async scheduleAppointment(data: {
    patientAppointmentId: number;
    doctorId: string;
    dateHour: string;
    duration: number;
    appointmentType: 'PRESENCIAL' | 'VIRTUAL';
    place?: string;
  }) {
    const { patientAppointmentId, doctorId, dateHour, duration, appointmentType, place } = data;

    // First, get an appointment for this doctor (or create one if needed)
    const doctorAppointment = await prisma.appointments.findFirst({
      where: {
        doctor_id: doctorId,
      },
    });

    if (!doctorAppointment) {
      throw new Error('No appointment type found for this doctor');
    }

    // Update the patient_appointment with the scheduled details
    const scheduledAppointment = await prisma.patient_appointment.update({
      where: {
        patient_appointment_id: patientAppointmentId,
      },
      data: {
        appointment_id: doctorAppointment.appointment_id,
        date_hour: new Date(dateHour),
        duration,
        appointment_type: appointmentType,
        place,
        appointment_status: 'PROGRAMMED',
      },
      include: {
        patient: {
          include: {
            user: true,
          },
        },
        appointment: {
          include: {
            doctor: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    return scheduledAppointment;
  }

}
