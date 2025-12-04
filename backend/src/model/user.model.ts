// backend/src/model/user.model.ts
import { Request, Response } from "express";
import { prisma } from "../util/prisma";

// const prisma = new PrismaClient();

export default class User {
    constructor() { }

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

        return newRiskForm;
    }

    static async getUserByPatientId(PatientId: string) {
        try {
            const user = await prisma.patients.findUnique({
                where: { patient_id: PatientId },
                include: { user: true }
            })
            if (!user) throw new Error("No user found with given patient id");

            return user;
        } catch (error) {
            throw new Error("Request to db for user with patient id failed");
        }
    }
}

// Check if username already exists
export const checkUsernameExists = async (
    username: string
): Promise<boolean> => {
    try {
        const existingUser = await prisma.users.findFirst({
            where: { username },
        });
        return !!existingUser;
    } catch (error) {
        return true;
    }
};

export const reportUser = async (userId: string, messageId: number, cause: string) => {
  try {
    const report = await prisma.user_reports.create({
      data: {
        user_id: userId,              
        reported_message: messageId,  
        cause: cause,                 
        date: new Date(),             
        status: false,               
      },
    });
    return { success: true, data: report };
  } catch (error) {
    console.error("Error al crear reporte de usuario en BD:", error);
    return { success: false, error };
  }
};