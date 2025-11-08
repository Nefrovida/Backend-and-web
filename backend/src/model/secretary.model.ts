import { PrismaClient } from "../../prisma/database/prisma/client";
const prisma = new PrismaClient;

export default class Secretary{ 
    constructor() {

    }
    static async getAppointmentsPerDay (targetDate: string | Date) {
        const date = new Date(targetDate); //Ocupo Date Object
        date.setHours(0,0,0,0); // El día comienza a las 00:00

        const appointments = await prisma.patient_appointment.findMany({
            where: {
                date_hour: {
                    gte: date,
                    lt: new Date(date.getTime() + 24 * 60 * 60 * 1000)
                },
            },
        });

        console.log(appointments);
        return appointments;

    }

}