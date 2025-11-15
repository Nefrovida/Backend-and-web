import { Request, Response } from 'express';
import { prisma } from '../util/prisma';

export default class User {
    User() {

    }

    static async getAppointmentByUserId(UserId: string) {
    const appointments = await prisma.patient_appointment.findMany({
        where: { patient_id: UserId },
    });

    const analysis = await prisma.patient_analysis.findMany({
        where: { patient_id: UserId },
    });

    return { appointments, analysis };
        }

    
}