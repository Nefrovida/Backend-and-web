import { prisma } from "../util/prisma";

export default class Agenda {
  constructor() {}

  /**
   * Secretaria (web) – Daily appointments, including patient name.
   */
  static async getAppointmentsPerDaySec(targetDate: string) {
    const [year, month, day] = targetDate.split("-").map(Number);

    // Local time MX
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

    // Unnest joins -> patient name
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

  /**
   * Mobile – Daily appointments, including doctor name.
   */
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
            name: true,
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

    // Unnest -> doctor name + appointment name
    return appointments.map((a) => {
      const { appointment, ...rest } = a;
      const doctorUser = appointment?.doctor?.user;

      const fullName = [
        doctorUser?.name,
        doctorUser?.parent_last_name,
        doctorUser?.maternal_last_name,
      ]
        .filter(Boolean)
        .join(" ");

      const appointmentName = appointment?.name?.trim() ?? null;

      return {
        ...rest,
        appointment_id: appointment?.appointment_id ?? null,
        name: fullName || null,
        doctor_name: fullName || null,
        appointment_name: appointmentName,
      };
    });
  }

  /**
   * Mobile – Cancel appointment by patient_appointment_id
   */
  static async cancelAppointment(id: number) {
    await prisma.patient_appointment.update({
      where: { patient_appointment_id: id },
      data: { appointment_status: "CANCELED" },
    });
  }

  /**
   * Mobile – Cancel analysis by patient_analysis_id
   */
  static async cancelAnalysis(id: number) {
    await prisma.patient_analysis.update({
      where: { patient_analysis_id: id },
      data: { analysis_status: "CANCELED" },
    });
  }
  /**
   * Mobile – Analysis details (card), by id.
   */
  static async getAnalysisById(id: number) {
    const analysis = await prisma.patient_analysis.findUnique({
      where: {
        patient_analysis_id: Number(id),
      },
      select: {
        patient_analysis_id: true,
        analysis_date: true,
        place: true,
        duration: true,
        analysis_status: true,
        analysis: {
          select: {
            analysis_id: true,
            name: true,
          },
        },
      },
    });

    if (!analysis) return null;

    const {
      analysis: nestedAnalysis,
      analysis_date,
      patient_analysis_id,
      place,
      duration,
      analysis_status,
    } = analysis;

    const analysisName = nestedAnalysis?.name?.trim() ?? null;

    return {
      type: "ANALYSIS",
      analysisId: nestedAnalysis?.analysis_id ?? null,
      analysisName,
      analysisDate: analysis_date,
      patientAnalysisId: patient_analysis_id,
      place,
      duration,
      analysisStatus: analysis_status,
    };
  }

  /**
   * Mobile – Appointment details (card), by id.
   */
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
            name: true,
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

    const appointment_name = nestedAppointment?.name?.trim() ?? null;

    return {
      ...rest,
      type: "APPOINTMENT",
      appointment_id: nestedAppointment?.appointment_id ?? null,
      doctor_name: fullName || null,
      appointment_name,
    };
  }

  /**
   * Web – List of appointments in a date range (calendar view).
   */
  static async getAppointmentsInRange(startDate: string, endDate: string) {
    // Parse date components to avoid timezone issues
    const [startYear, startMonth, startDay] = startDate.split("-").map(Number);
    const [endYear, endMonth, endDay] = endDate.split("-").map(Number);

    const start = new Date(startYear, startMonth - 1, startDay);
    const end = new Date(endYear, endMonth - 1, endDay);

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
        appointment: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        date_hour: "asc",
      },
    });

    return appointments.map((a) => {
      const user = a.patient?.user;
      const { patient, appointment, ...rest } = a;

      const fullName = [
        user?.name,
        user?.parent_last_name,
        user?.maternal_last_name,
      ]
        .filter(Boolean)
        .join(" ");

      return {
        ...rest,
        // patient name for web view
        name: fullName || null,
        appointment_name: appointment?.name?.trim() ?? null,
      };
    });
  }

  /**
   * Secretaria – appointment request list (status REQUESTED).
   */
  static async getPendingAppointmentRequests() {
    const requests = (await prisma.patient_appointment.findMany({
      where: {
        appointment_status: "REQUESTED" as any,
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
        date_hour: "asc",
      },
    })) as any[];

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
    // Parse date components to avoid timezone issues
    const [year, month, day] = date.split("-").map(Number);
    const targetDate = new Date(year, month - 1, day); // month is 0-indexed in JS Date
    const startOfDay = new Date(year, month - 1, day, 0, 0, 0, 0);
    const endOfDay = new Date(year, month - 1, day, 23, 59, 59, 999);

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
          in: ["PROGRAMMED", "FINISHED"],
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
        const slotTime = new Date(year, month - 1, day, hour, minute, 0, 0);

        // Check if this slot conflicts with any booked appointment
        const isBooked = bookedAppointments.some((appt) => {
          if (!appt.date_hour) return false;
          const apptStart = new Date(appt.date_hour);
          // If duration is 45 minutes, treat it as occupying the full hour
          const effectiveDuration = appt.duration === 45 ? 60 : appt.duration;
          const apptEnd = new Date(
            apptStart.getTime() + effectiveDuration * 60000
          );
          return slotTime >= apptStart && slotTime < apptEnd;
        });

        if (!isBooked) {
          availableSlots.push(
            `${hour.toString().padStart(2, "0")}:${minute
              .toString()
              .padStart(2, "0")}`
          );
        }
      }
    }

    return availableSlots;
  }

  static async getLaboratoryAvailability(date: string) {
    // Parse date components to avoid timezone issues
    const [year, month, day] = date.split('-').map(Number);
    const targetDate = new Date(year, month - 1, day); // month is 0-indexed in JS Date
    const startOfDay = new Date(year, month - 1, day, 0, 0, 0, 0);
    const endOfDay = new Date(year, month - 1, day, 23, 59, 59, 999);

    // Get all scheduled analyses for this date
    const bookedAnalyses = await prisma.patient_analysis.findMany({
      where: {
        analysis_date: {
          gte: startOfDay,
          lte: endOfDay,
        },
        analysis_status: {
          in: ["PROGRAMMED", "LAB"],
        },
      },
      select: {
        analysis_date: true,
        duration: true,
      },
    });

    // Generate available time slots (e.g., 7 AM to 5 PM, every 30 minutes)
    const availableSlots: string[] = [];
    const workStart = 7; // 7 AM
    const workEnd = 17; // 5 PM

    for (let hour = workStart; hour < workEnd; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const slotTime = new Date(year, month - 1, day, hour, minute, 0, 0);

        // Check if this slot conflicts with any booked analysis
        const isBooked = bookedAnalyses.some((analysis) => {
          if (!analysis.analysis_date) return false;
          const analysisStart = new Date(analysis.analysis_date);
          const analysisEnd = new Date(analysisStart.getTime() + analysis.duration * 60000);
          return slotTime >= analysisStart && slotTime < analysisEnd;
        });

        if (!isBooked) {
          availableSlots.push(
            `${hour.toString().padStart(2, "0")}:${minute
              .toString()
              .padStart(2, "0")}`
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
    appointmentType: "PRESENCIAL" | "VIRTUAL";
    place?: string;
  }) {
    const {
      patientAppointmentId,
      doctorId,
      dateHour,
      duration,
      appointmentType,
      place,
    } = data;

    const proposedStart = new Date(dateHour);
    const now = new Date();

    if (proposedStart <= now) {
      throw new Error("Appointment date and time must be in the future");
    }

    const proposedEnd = new Date(proposedStart.getTime() + duration * 60000);

    // Check for conflicts with doctor
    const doctorConflicts = await prisma.patient_appointment.findMany({
      where: {
        appointment: {
          doctor_id: doctorId,
        },
        appointment_status: {
          not: "CANCELED",
        },
        OR: [
          {
            date_hour: {
              lt: proposedEnd,
            },
            AND: {
              date_hour: {
                gte: proposedStart,
              },
            },
          },
          {
            date_hour: {
              lte: proposedStart,
            },
            AND: [
              {
                date_hour: {
                  gte: new Date(proposedStart.getTime() - 24 * 60 * 60 * 1000), // rough, but better to calculate
                },
              },
            ],
          },
        ],
      },
    });

    // Better overlap check
    const doctorOverlaps = doctorConflicts.filter((appt) => {
      const apptStart = new Date(appt.date_hour);
      // If existing appointment is 45 min, treat it as occupying 60 min
      const effectiveExistingDuration =
        appt.duration === 45 ? 60 : appt.duration;
      const apptEnd = new Date(
        apptStart.getTime() + effectiveExistingDuration * 60000
      );
      // For checking conflicts, if the new appointment is 45 min, treat it as 60 min
      const effectiveNewDuration = duration === 45 ? 60 : duration;
      const newEnd = new Date(
        proposedStart.getTime() + effectiveNewDuration * 60000
      );
      return proposedStart < apptEnd && newEnd > apptStart;
    });

    if (doctorOverlaps.length > 0) {
      throw new Error("Doctor has a conflicting appointment at this time");
    }

    // Get the patient_appointment to check patient conflicts
    const patientAppt = await prisma.patient_appointment.findUnique({
      where: { patient_appointment_id: patientAppointmentId },
    });

    if (!patientAppt) {
      throw new Error("Patient appointment not found");
    }

    // Check for conflicts with patient
    const patientConflicts = await prisma.patient_appointment.findMany({
      where: {
        patient_id: patientAppt.patient_id,
        appointment_status: {
          not: "CANCELED",
        },
        patient_appointment_id: {
          not: patientAppointmentId, // exclude current if updating
        },
      },
    });

    const patientOverlaps = patientConflicts.filter((appt) => {
      const apptStart = new Date(appt.date_hour);
      // If existing appointment is 45 min, treat it as occupying 60 min
      const effectiveExistingDuration =
        appt.duration === 45 ? 60 : appt.duration;
      const apptEnd = new Date(
        apptStart.getTime() + effectiveExistingDuration * 60000
      );
      // For checking conflicts, if the new appointment is 45 min, treat it as 60 min
      const effectiveNewDuration = duration === 45 ? 60 : duration;
      const newEnd = new Date(
        proposedStart.getTime() + effectiveNewDuration * 60000
      );
      return proposedStart < apptEnd && newEnd > apptStart;
    });

    if (patientOverlaps.length > 0) {
      throw new Error("Patient has a conflicting appointment at this time");
    }

    // First, get an appointment for this doctor (or create one if needed)
    const doctorAppointment = await prisma.appointments.findFirst({
      where: {
        doctor_id: doctorId,
      },
    });

    if (!doctorAppointment) {
      throw new Error("No appointment type found for this doctor");
    }

    // Update the patient_appointment with the scheduled details
    const scheduledAppointment = await prisma.patient_appointment.update({
      where: {
        patient_appointment_id: patientAppointmentId,
      },
      data: {
        appointment_id: doctorAppointment.appointment_id,
        date_hour: proposedStart,
        duration,
        appointment_type: appointmentType,
        place,
        appointment_status: "PROGRAMMED",
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
  static async createAppointment(data: {
    patientId: string;
    doctorId: string;
    dateHour: string;
    duration: number;
    appointmentType: "PRESENCIAL" | "VIRTUAL";
    place?: string;
  }) {
    const { patientId, doctorId, dateHour, duration, appointmentType, place } =
      data;

    const [datePart, timePart] = dateHour.split("T");
    const [year, month, day] = datePart.split("-").map(Number);
    const [hours, minutes] = timePart.split(":").map(Number);

    const proposedStart = new Date(
      Date.UTC(year, month - 1, day, hours, minutes)
    );
    const now = new Date();

    if (proposedStart <= now) {
      throw new Error("Appointment date and time must be in the future");
    }

    const proposedEnd = new Date(proposedStart.getTime() + duration * 60000);

    // Check for conflicts with doctor
    const doctorConflicts = await prisma.patient_appointment.findMany({
      where: {
        appointment: {
          doctor_id: doctorId,
        },
        appointment_status: {
          not: "CANCELED",
        },
      },
    });

    const doctorOverlaps = doctorConflicts.filter((appt) => {
      const apptStart = new Date(appt.date_hour);
      const apptEnd = new Date(apptStart.getTime() + appt.duration * 60000);
      // For checking conflicts, if the new appointment is 45 min, treat it as 60 min
      const effectiveNewDuration = duration === 45 ? 60 : duration;
      const newEnd = new Date(
        proposedStart.getTime() + effectiveNewDuration * 60000
      );
      return proposedStart < apptEnd && newEnd > apptStart;
    });

    if (doctorOverlaps.length > 0) {
      throw new Error("Doctor has a conflicting appointment at this time");
    }

    // Check for conflicts with patient
    const patientConflicts = await prisma.patient_appointment.findMany({
      where: {
        patient_id: patientId,
        appointment_status: {
          not: "CANCELED",
        },
      },
    });

    const patientOverlaps = patientConflicts.filter((appt) => {
      const apptStart = new Date(appt.date_hour);
      // If existing appointment is 45 min, treat it as occupying 60 min
      const effectiveExistingDuration =
        appt.duration === 45 ? 60 : appt.duration;
      const apptEnd = new Date(
        apptStart.getTime() + effectiveExistingDuration * 60000
      );
      // For checking conflicts, if the new appointment is 45 min, treat it as 60 min
      const effectiveNewDuration = duration === 45 ? 60 : duration;
      const newEnd = new Date(
        proposedStart.getTime() + effectiveNewDuration * 60000
      );
      return proposedStart < apptEnd && newEnd > apptStart;
    });

    if (patientOverlaps.length > 0) {
      throw new Error("Patient has a conflicting appointment at this time");
    }

    // Get an appointment for this doctor
    const doctorAppointment = await prisma.appointments.findFirst({
      where: {
        doctor_id: doctorId,
      },
    });

    if (!doctorAppointment) {
      throw new Error("No appointment type found for this doctor");
    }

    // Create a new patient_appointment directly
    const newAppointment = await prisma.patient_appointment.create({
      data: {
        patient_id: patientId,
        appointment_id: doctorAppointment.appointment_id,
        date_hour: proposedStart.toISOString(),
        duration,
        appointment_type: appointmentType,
        place:
          place ||
          (appointmentType === "PRESENCIAL" ? "Consultorio" : undefined),
        appointment_status: "PROGRAMMED",
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

    return newAppointment;
  }

  static async getAppointmentsPerDayByAppointmentId(
    targetDate: string,
    appointmentId: number
  ) {
    const [year, month, day] = targetDate.split("-").map(Number);

    // rangos por si la fecha viene así: 2025-11-14T01:19:52.415
    const start = new Date(year, month - 1, day, 0, 0, 0);
    const end = new Date(year, month - 1, day + 1, 0, 0, 0);

    const appointments = await prisma.patient_appointment.findMany({
      where: {
        date_hour: {
          gte: start,
          lt: end,
        },
        appointment_id: appointmentId,
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

    return appointments.map((a) => {
      const { patient, ...rest } = a;
      const user = patient?.user;

      return {
        ...rest,
        patient_name: user?.name ?? null,
        patient_parent_last_name: user?.parent_last_name ?? null,
        patient_maternal_last_name: user?.maternal_last_name ?? null,
      };
    });
  }

  /**
   * Mobile – Daily appointments per patient Id, including doctor name.
   */
  static async getAppointmentsPerPatient(targetDate: string, userId: string) {
    const [year, month, day] = targetDate.split("-").map(Number);

    const start = new Date(year, month - 1, day, 0, 0, 0);
    const end = new Date(year, month - 1, day + 1, 0, 0, 0);

    const patient = await prisma.patients.findFirst({
      where: { user_id: userId },
      select: { patient_id: true },
    });

    if (!patient) return [];

    const patientId = patient.patient_id;

    const [appointments, analysis] = await Promise.all([
      prisma.patient_appointment.findMany({
        where: {
          patient_id: patientId,
          date_hour: { gte: start, lt: end },
          appointment_status: { in: ["PROGRAMMED", "REQUESTED"] },
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
              name: true,
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
      }),

      prisma.patient_analysis.findMany({
        where: {
          patient_id: patientId,
          analysis_date: { gte: start, lt: end },
          analysis_status: { in: ["PROGRAMMED", "REQUESTED"] },
        },
        select: {
          patient_analysis_id: true,
          patient_id: true,
          analysis_date: true,
          analysis_status: true,
          place: true,
          duration: true,
          analysis: {
            select: {
              analysis_id: true,
              name: true,
            },
          },
        },
      }),
    ]);

    const formattedAppointments = appointments.map((a) => {
      const doctorUser = a.appointment?.doctor?.user;
      const fullName = [
        doctorUser?.name,
        doctorUser?.parent_last_name,
        doctorUser?.maternal_last_name,
      ]
        .filter(Boolean)
        .join(" ");

      return {
        type: "APPOINTMENT",
        patient_appointment_id: a.patient_appointment_id,
        appointment_name: a.appointment?.name,
        doctor_name: fullName,
        date_hour: a.date_hour,
        place: a.place,
        link: a.link,
        appointment_type: a.appointment_type,
        appointment_status: a.appointment_status,
      };
    });

    const formattedAnalysis = analysis.map((an) => ({
      type: "ANALYSIS",
      patientAnalysisId: an.patient_analysis_id,
      analysisName: an.analysis?.name,
      analysisDate: an.analysis_date,
      place: an.place,
      duration: an.duration,
      analysisStatus: an.analysis_status,
    }));

    return {
      appointments: formattedAppointments,
      analysis: formattedAnalysis,
    };
  }
}
