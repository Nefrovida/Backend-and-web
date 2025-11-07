import { PrismaClient } from "@client";

const prisma = new PrismaClient;

export default class Laboratory {
    Laboratory() {

    }

    static async getLabResults() {
        const patientResults = await prisma.patient_analysis.findMany({});
        return patientResults;
    }
}