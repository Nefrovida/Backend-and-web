import { patient_analysis } from './../../prisma/database/prisma/client';
import {PrismaClient} from "@prisma/client";
const prisma = new PrismaClient;

export default class Laboratory {
    Laboratory() {

    }

    static async getLabResults() {
        const patientResults = await prisma.patient_analysis.findMany({
            includes: {
                patients: true,
            }
        });
        return patientResults;
    }
}