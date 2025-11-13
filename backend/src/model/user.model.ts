import { Request, Response } from 'express';
import { PrismaClient } from '../../prisma/database/prisma/client.js';
const prisma = new PrismaClient();

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

    static async postRiskFormByUserId(UserId: string, riskFormData: any) {
    const newRiskForm = await prisma.patient_history.create({
        data: {
            patient_id: UserId,
            ...riskFormData,
        },
    });
    }
}