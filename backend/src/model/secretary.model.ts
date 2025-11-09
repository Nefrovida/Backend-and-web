import { PrismaClient } from "../../prisma/database/prisma/client.js";
const prisma = new PrismaClient();

export default class Secretary{ 
    constructor() {

    }
static async getAppointmentsPerDay(targetDate: string) {
  // Convierte a hora de Mexico
  const [year, month, day] = targetDate.split('-').map(Number);
  const start = new Date(year, month - 1, day, 0, 0, 0);  
  const end = new Date(year, month - 1, day + 1, 0, 0, 0); 

  /*console.log("Searching between (LOCAL FIX):");
  console.log("gte:", start);
  console.log("lt:", end);*/

  const appointments = await prisma.patient_appointment.findMany({
    where: {
      date_hour: {
        gte: start,
        lt: end,
      },
    },
  });

  console.log("Results:", appointments);
  return appointments;
}

static async scheduleAppointment(
  patientAppointmentId: number,
  doctorId: string,
  dateHourISO: string,
  duration?: number,
  place?: string,
  link?: string
) {
  const date = new Date(dateHourISO);
  if (isNaN(date.getTime())) {
    throw new Error("Invalid dateHourISO");
  }

  //validar que el doctor si exista
  const doctorExists = await prisma.doctors.findUnique({
    where: { doctor_id: doctorId },
  });

  if (!doctorExists) {
    throw new Error("Doctor not found");
  }

  // ver si el doctor tiene una cita en ese tiempo
  const endTime = new Date(date.getTime() + (duration || 45) * 60 * 1000); // default 45 mins

  const conflictingAppointment = await prisma.patient_appointment.findFirst({
    where: {
      appointment: {
        doctor_id: doctorId,
      },
      appointment_status: "PROGRAMMED",
      date_hour: {
        gte: date,
        lt: endTime,
      },
    },
  });

  if (conflictingAppointment) {
    throw new Error("Doctor has a conflicting appointment");
  }

  // actualizar la cita del paciente para asignarle el doctor y detalles
  const patientAppointment = await prisma.patient_appointment.findUnique({
    where: { patient_appointment_id: patientAppointmentId },
    select: { appointment_id: true },
  });

  if (!patientAppointment) {
    throw new Error("Patient appointment not found");
  }

  await prisma.appointments.update({
    where: {
      appointment_id: patientAppointment.appointment_id,
    },
    data: {
      doctor_id: doctorId,
    },
  });

  // actualizar la cita del paciente
  const updateData: any = {
    date_hour: date,
    appointment_status: "PROGRAMMED",
  };

  if (typeof duration === "number") updateData.duration = duration;
  if (typeof place === "string") updateData.place = place;
  if (typeof link === "string") updateData.link = link;

  const updated = await prisma.patient_appointment.update({
    where: { patient_appointment_id: patientAppointmentId },
    data: updateData,
  });

  return updated;
}

static async getAppointmentRequests() {
  const requests = await prisma.patient_appointment.findMany({
    where: {
      appointment_status: "REQUESTED",
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

  return requests;
}

static async getDoctors() {
  const doctors = await prisma.doctors.findMany({
    include: {
      user: {
        select: {
          name: true,
          parent_last_name: true,
          maternal_last_name: true,
          phone_number: true,
          active: true,
        },
      },
    },
    where: {
      user: {
        active: true,
      },
    },
  });

  return doctors;
}

static async getDoctorAvailability(doctorId: string, dateStr: string) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const startOfDay = new Date(year, month - 1, day, 0, 0, 0);
  const endOfDay = new Date(year, month - 1, day + 1, 0, 0, 0);

  // obtener todas las citas programadas del doctor en ese día
  const scheduledAppointments = await prisma.patient_appointment.findMany({
    where: {
      appointment: {
        doctor_id: doctorId,
      },
      appointment_status: "PROGRAMMED",
      date_hour: {
        gte: startOfDay,
        lt: endOfDay,
      },
    },
    select: {
      date_hour: true,
      duration: true,
    },
  });

  // Definir el horario laboral (por ejemplo, de 9 a. m. a 5 p. m.)
  const workStart = 9;
  const workEnd = 17;
  const slotDuration = 30; // bloques de 30 minutos

  // generar todos los posibles bloques
  const allSlots: { start: Date; end: Date; available: boolean }[] = [];
  for (let hour = workStart; hour < workEnd; hour++) {
    for (let minute = 0; minute < 60; minute += slotDuration) {
      const slotStart = new Date(year, month - 1, day, hour, minute, 0);
      const slotEnd = new Date(slotStart.getTime() + slotDuration * 60 * 1000);
      
      if (slotEnd.getHours() > workEnd || (slotEnd.getHours() === workEnd && slotEnd.getMinutes() > 0)) {
        break;
      }

      // checar si el bloque se cruza con alguna cita programada
      const isAvailable = !scheduledAppointments.some((appt: { date_hour: Date | null; duration: number }) => {
        if (!appt.date_hour) return false; // saltar citas sin fecha
        const apptStart = new Date(appt.date_hour);
        const apptEnd = new Date(apptStart.getTime() + (appt.duration || 45) * 60 * 1000);
        
        // bloque se cruza si se sobrepone con la cita
        return (slotStart >= apptStart && slotStart < apptEnd) || 
               (slotEnd > apptStart && slotEnd <= apptEnd) ||
               (slotStart <= apptStart && slotEnd >= apptEnd);
      });

      allSlots.push({
        start: slotStart,
        end: slotEnd,
        available: isAvailable,
      });
    }
  }

  return allSlots;
}



}