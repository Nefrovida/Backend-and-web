import { PrismaClient } from "../../prisma/database/prisma/client";
const prisma = new PrismaClient;

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



}